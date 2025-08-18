import io, json, os, time, traceback, hashlib
from urllib.parse import urlparse, parse_qs
from fdk import response
import oci

BUCKET = os.getenv("BUCKET", "cloud-resume-data")
OBJECT = os.getenv("OBJECT", "counter.json")
SALT = os.getenv("SALT", "change-me")  # unique visitor hashing salt

def get_client():
    signer = oci.auth.signers.get_resource_principals_signer()
    return oci.object_storage.ObjectStorageClient(config={}, signer=signer)

def get_namespace(client):
    return client.get_namespace().data

def _default_doc():
    return {
        "pageviews": 0,
        "uniqueVisitors": 0,
        "seen": [],  # list of hashed visitor ids
        "updatedAt": int(time.time()),
    }

def _upgrade_schema(d):
    # Migrate old {"count": N} into new schema
    if not isinstance(d, dict):
        return _default_doc()
    if "pageviews" not in d and "count" in d:
        d = {
            "pageviews": int(d.get("count", 0)),
            "uniqueVisitors": int(d.get("uniqueVisitors", 0)),
            "seen": d.get("seen", []),
            "updatedAt": int(time.time()),
        }
    # Ensure required fields exist
    base = _default_doc()
    base.update({
        "pageviews": int(d.get("pageviews", 0)),
        "uniqueVisitors": int(d.get("uniqueVisitors", 0)),
        "seen": d.get("seen", []),
        "updatedAt": int(d.get("updatedAt", int(time.time()))),
    })
    if not isinstance(base["seen"], list):
        base["seen"] = []
    return base

def read_doc(client, ns):
    try:
        resp = client.get_object(ns, BUCKET, OBJECT)
        data = json.loads(resp.data.content.decode())
        return _upgrade_schema(data), resp.headers.get("etag")
    except oci.exceptions.ServiceError as e:
        if e.status == 404:
            return _default_doc(), None
        raise

def write_doc(client, ns, doc, if_match=None):
    doc["updatedAt"] = int(time.time())
    body = json.dumps(doc, separators=(",", ":"))
    client.put_object(
        ns, BUCKET, OBJECT,
        io.BytesIO(body.encode()), content_type="application/json",
        if_match=if_match
    )

def _get_method():
    return os.environ.get("FN_HTTP_METHOD", "GET").upper()

def _get_vid_from_ctx(ctx):
    # Extract ?vid=... from URL
    try:
        url = None
        if hasattr(ctx, "RequestURL") and callable(getattr(ctx, "RequestURL")):
            url = ctx.RequestURL()
        if not url:
            url = os.environ.get("FN_HTTP_REQUEST_URL", "")
        qs = parse_qs(urlparse(url).query)
        return qs.get("vid", [None])[0]
    except Exception:
        return None

def _hash_uid(uid):
    if not uid:
        return None
    h = hashlib.sha256()
    h.update(SALT.encode("utf-8"))
    h.update(b":")
    h.update(str(uid).encode("utf-8"))
    return h.hexdigest()

def handler(ctx, data: io.BytesIO=None):
    # Handle preflight quickly if needed
    if _get_method() == "OPTIONS":
        return response.Response(
            ctx, status_code=204, response_data="",
            headers={
                "Access-Control-Allow-Origin": "https://www.yunusergul.com",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "content-type",
                "Cache-Control": "no-store",
            }
        )

    client = get_client()
    ns = get_namespace(client)
    try:
        vid = _get_vid_from_ctx(ctx)
        uid_hash = _hash_uid(vid)

        for _ in range(5):
            doc, etag = read_doc(client, ns)

            # Increment pageviews on every request
            doc["pageviews"] = int(doc.get("pageviews", 0)) + 1

            # Increment uniqueVisitors if this uid not seen before
            if uid_hash:
                seen = doc.get("seen", [])
                if uid_hash not in seen:
                    seen.append(uid_hash)
                    doc["seen"] = seen
                    doc["uniqueVisitors"] = int(doc.get("uniqueVisitors", 0)) + 1

            try:
                write_doc(client, ns, doc, if_match=etag)
                payload = {
                    "ok": True,
                    # keep backwards compatibility
                    "count": doc["pageviews"],
                    "unique": doc.get("uniqueVisitors", 0),
                    "updatedAt": doc.get("updatedAt"),
                }
                return response.Response(
                    ctx,
                    response_data=json.dumps(payload),
                    headers={
                        "Content-Type": "application/json",
                        "Cache-Control": "no-store",
                        "Access-Control-Allow-Origin": "https://www.yunusergul.com",
                        "Access-Control-Allow-Methods": "GET,OPTIONS",
                        "Access-Control-Allow-Headers": "content-type"
                    }
                )
            except oci.exceptions.ServiceError as e:
                if e.status == 412:
                    continue
                print(f"ObjectStorage error: status={e.status}, code={getattr(e, 'code', '')}, message={e.message}")
                raise
        return response.Response(ctx, status_code=500,
            response_data=json.dumps({"ok": False, "error": "conflict"}),
            headers={
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
                "Access-Control-Allow-Origin": "https://www.yunusergul.com",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "content-type"
            })
    except Exception as e:
        print("Unhandled exception:\n", traceback.format_exc())
        return response.Response(ctx, status_code=500,
            response_data=json.dumps({"ok": False, "error": str(e)}),
            headers={
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
                "Access-Control-Allow-Origin": "https://www.yunusergul.com",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "content-type"
            })

if __name__ == "__main__":
    import fdk
    fdk.handle(handler)