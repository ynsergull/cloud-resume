# visitor-counter Function

Python Oracle Function that tracks total pageviews and unique visitors (privacy-friendly, browser-based) in Object Storage using optimistic concurrency with ETags.

## Files
- `func.py` – Handler logic: reads JSON doc, increments pageviews, counts unique visitors via salted-hash, retries on ETag conflicts, writes back.
- `func.yaml` – Function metadata (runtime, entrypoint, trigger spec for local `fn` testing—Gateway will front real traffic).
- `requirements.txt` – Python dependencies (Oracle Function Development Kit + OCI SDK).

## Environment Variables (optional overrides)
- `BUCKET` – Bucket name (default: cloud-resume-data)
- `OBJECT` – Object key (default: counter.json)
- `SALT` – Secret salt used to hash the browser-provided visitorId (default: "change-me"). Set a strong random value in Function Config.

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
Create a deployment mapping GET /counter to this function. Frontend passes `?vid=<uuid>` (stable per-browser). CORS is enabled for `https://www.yunusergul.com`.

## Response JSON
On success:
{
	"ok": true,
	"count": <int>,           // total pageviews (back-compat)
	"unique": <int>,          // total unique visitors (browser-based)
	"updatedAt": <unix_ts>
}
On error after retries:
{"ok": false, "error": "conflict"}

## Stored Document Schema (counter.json)
{
	"pageviews": <int>,
	"uniqueVisitors": <int>,
	"seen": ["<sha256-hash>", ...],  // hashed visitor IDs (salted)
	"updatedAt": <unix_ts>
}

Older documents with only `{ "count": N }` are auto-migrated in-memory to the new schema on first write; response still includes `count` for backward compatibility.

## Notes
- SALT should be treated as a secret and not checked into source control. Configure it in the Function's application config.
- For very high traffic, consider switching from storing `seen` as a list to an approximate distinct counter (e.g., HyperLogLog) or partition by day.
