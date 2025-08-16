import io, json, os, time, traceback
from fdk import response
import oci

BUCKET = os.getenv("BUCKET", "cloud-resume-data")
OBJECT = os.getenv("OBJECT", "counter.json")

def get_client():
    signer = oci.auth.signers.get_resource_principals_signer()
    return oci.object_storage.ObjectStorageClient(config={}, signer=signer)

def get_namespace(client):
    return client.get_namespace().data

def read_counter(client, ns):
    try:
        resp = client.get_object(ns, BUCKET, OBJECT)
        data = json.loads(resp.data.content.decode())
        return data.get("count", 0), resp.headers.get("etag")
    except oci.exceptions.ServiceError as e:
        if e.status == 404:
            return 0, None
        raise

# DEĞİŞTİ: if_match adında keyword parametre kabul et
def write_counter(client, ns, count, if_match=None):
    body = json.dumps({"count": count, "updatedAt": int(time.time())})
    client.put_object(
        ns, BUCKET, OBJECT,
        io.BytesIO(body.encode()), content_type="application/json",
        if_match=if_match
    )

def handler(ctx, data: io.BytesIO=None):
    client = get_client()
    ns = get_namespace(client)
    try:
        for _ in range(5):
            cnt, etag = read_counter(client, ns)
            try:
                # if_match keyword ile çağır
                write_counter(client, ns, cnt + 1, if_match=etag)
                return response.Response(
                    ctx,
                    response_data=json.dumps({"ok": True, "count": cnt + 1}),
                    headers={"Content-Type": "application/json"}
                )
            except oci.exceptions.ServiceError as e:
                if e.status == 412:
                    continue
                print(f"ObjectStorage error: status={e.status}, code={getattr(e, 'code', '')}, message={e.message}")
                raise
        return response.Response(ctx, status_code=500,
            response_data=json.dumps({"ok": False, "error": "conflict"}),
            headers={"Content-Type": "application/json"})
    except Exception as e:
        print("Unhandled exception:\n", traceback.format_exc())
        return response.Response(ctx, status_code=500,
            response_data=json.dumps({"ok": False, "error": str(e)}),
            headers={"Content-Type": "application/json"})

if __name__ == "__main__":
    import fdk
    fdk.handle(handler)