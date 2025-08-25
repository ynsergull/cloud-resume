import io, json, os, time, traceback, hashlib
from urllib.parse import urlparse, parse_qs
from fdk import response
import oci

BUCKET = os.getenv("BUCKET", "cloud-resume-data")
OBJECT = os.getenv("OBJECT", "counter.json")
SALT = os.getenv("SALT", "change-me")
TOPIC_OCID = os.getenv("TOPIC_OCID")
REPORT_TOKEN = os.getenv("REPORT_TOKEN")

def get_client():
    signer = oci.auth.signers.get_resource_principals_signer()
    return oci.object_storage.ObjectStorageClient(config={}, signer=signer)

def get_namespace(client):
    return client.get_namespace().data

def get_ons_client():
    signer = oci.auth.signers.get_resource_principals_signer()
    client = oci.ons.NotificationDataPlaneClient(config={}, signer=signer)
    region = os.getenv("OCI_RESOURCE_PRINCIPAL_REGION")
    if region:
        client.base_client.set_region(region)
    return client

def _default_doc():
    return {"pageviews": 0, "uniqueVisitors": 0, "seen": [], "updatedAt": int(time.time())}

def _upgrade_schema(d):
    if not isinstance(d, dict):
        return _default_doc()
    if "pageviews" not in d and "count" in d:
        d = {"pageviews": int(d.get("count", 0)), "uniqueVisitors": int(d.get("uniqueVisitors", 0)), "seen": d.get("seen", []), "updatedAt": int(time.time())}
    base = _default_doc()
    base.update({"pageviews": int(d.get("pageviews", 0)), "uniqueVisitors": int(d.get("uniqueVisitors", 0)), "seen": d.get("seen", []), "updatedAt": int(d.get("updatedAt", int(time.time())))})
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
    client.put_object(ns, BUCKET, OBJECT, io.BytesIO(body.encode()), content_type="application/json", if_match=if_match)

def _get_method():
    return os.environ.get("FN_HTTP_METHOD", "GET").upper()

def _get_url_and_qs(ctx):
    url = None
    if hasattr(ctx, "RequestURL") and callable(getattr(ctx, "RequestURL")):
        url = ctx.RequestURL()
    if not url:
        url = os.environ.get("FN_HTTP_REQUEST_URL", "")
    parsed = urlparse(url)
    return parsed, parse_qs(parsed.query)

def _is_report_request(ctx):
    parsed, qs = _get_url_and_qs(ctx)
    if parsed.path.endswith("/report"):
        return True
    flag = qs.get("report", [None])[0]
    return str(flag).lower() in ("1", "true", "yes")

def _get_token(ctx):
    _, qs = _get_url_and_qs(ctx)
    return qs.get("token", [None])[0]

def _get_vid_from_ctx(ctx):
    try:
        _, qs = _get_url_and_qs(ctx)
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

def _cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Allow-Headers": "content-type",
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
        "Vary": "Origin"
    }

def _publish_report(doc):
    if not TOPIC_OCID:
        raise RuntimeError("TOPIC_OCID not configured")
    ons = get_ons_client()
    from oci.ons.models import MessageDetails
    ts_utc = time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime(doc.get("updatedAt", int(time.time()))))
    subject = f"Daily Resume Stats - {time.strftime('%Y-%m-%d', time.gmtime())}"
    body = f"Counter snapshot at {ts_utc}\n\n" + json.dumps(doc, indent=2)
    ons.publish_message(TOPIC_OCID, MessageDetails(title=subject, body=body))

def handler(ctx, data: io.BytesIO=None):
    if _get_method() == "OPTIONS":
        return response.Response(ctx, status_code=204, response_data="", headers=_cors_headers())

    client = get_client()
    ns = get_namespace(client)

    try:
        if _is_report_request(ctx):
            token = _get_token(ctx)
            if not REPORT_TOKEN or token != REPORT_TOKEN:
                return response.Response(ctx, status_code=403, response_data=json.dumps({"ok": False, "error": "forbidden"}), headers=_cors_headers())
            doc, _ = read_doc(client, ns)
            _publish_report(doc)
            return response.Response(ctx, response_data=json.dumps({"ok": True, "report": True}), headers=_cors_headers())

        vid = _get_vid_from_ctx(ctx)
        uid_hash = _hash_uid(vid) if vid else None

        for _ in range(5):
            doc, etag = read_doc(client, ns)
            doc["pageviews"] = int(doc.get("pageviews", 0)) + 1
            if uid_hash:
                seen = doc.get("seen", [])
                if uid_hash not in seen:
                    seen.append(uid_hash)
                    doc["seen"] = seen
                    doc["uniqueVisitors"] = int(doc.get("uniqueVisitors", 0)) + 1
            try:
                write_doc(client, ns, doc, if_match=etag)
                payload = {"ok": True, "count": doc["pageviews"], "unique": doc.get("uniqueVisitors", 0), "updatedAt": doc.get("updatedAt")}
                return response.Response(ctx, response_data=json.dumps(payload), headers=_cors_headers())
            except oci.exceptions.ServiceError as e:
                if e.status == 412:
                    continue
                print(f"ObjectStorage error: status={e.status}, message={getattr(e, 'message', '')}")
                raise

        return response.Response(ctx, status_code=500, response_data=json.dumps({"ok": False, "error": "conflict"}), headers=_cors_headers())
    except Exception as e:
        print("Unhandled exception:\n", traceback.format_exc())
        return response.Response(ctx, status_code=500, response_data=json.dumps({"ok": False, "error": str(e)}), headers=_cors_headers())

if __name__ == "__main__":
    import fdk
    fdk.handle(handler)