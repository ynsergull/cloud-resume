# visitor-counter Function

Python Oracle Function that increments a JSON counter stored in Object Storage using optimistic concurrency with ETags.

## Files
- `func.py` – Handler logic: reads current value, retries on ETag conflicts, writes updated value.
- `func.yaml` – Function metadata (runtime, entrypoint, trigger spec for local `fn` testing—Gateway will front real traffic).
- `requirements.txt` – Python dependencies (Oracle Function Development Kit + OCI SDK).

## Environment Variables (optional overrides)
- `NAMESPACE` – Object Storage namespace (default: fre87dxbjczh)
- `BUCKET` – Bucket name (default: cloud-resume-data)
- `OBJECT` – Object key (default: counter.json)

## Concurrency Strategy
1. GET object -> obtain current count + ETag.
2. PUT object with `if-match: <etag>` header.
3. If 412 Precondition Failed -> retry (up to 5 attempts).

## Local Invocation (after deploy)
```bash
fn invoke <your-app-name> visitor-counter
```
(Use POST when via API Gateway.)

## API Gateway
Create a deployment mapping POST /api/visitor to this function. Enable CORS (Allow: POST, Content-Type; Origin: * or your domain).

## Response JSON
{"ok": true, "count": <int>} on success.
{"ok": false, "error": "conflict"} after repeated ETag conflicts (rare at low traffic).

## Notes
The function silently creates the counter with value 1 if it doesn't exist yet.
