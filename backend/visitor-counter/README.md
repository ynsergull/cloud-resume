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
- `TOPIC_OCID` – OCI Notifications Topic OCID (for daily report emails)
- `REPORT_TOKEN` – Shared secret token to authorize `/report` endpoint calls

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
Create deployments mapping to this function:
- GET `/counter` – increments and returns counts; frontend passes `?vid=<uuid>`.
- GET `/report` – sends an email with current JSON; requires `?token=${REPORT_TOKEN}`.

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

Report endpoint:
{"ok": true, "report": true} on success.

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

## IAM (Policies & Dynamic Group)
If your Functions run in the root tenancy compartment, write tenancy-scoped policies. Example:

- Dynamic Group (matching all functions in your compartment or tenancy):
	- Rule example (tenancy-wide): `ALL {resource.type = 'fnfunc'}`

- Policies (tenancy-level):
	- `allow dynamic-group dg-cloud-resume to read object-family in tenancy`
	- `allow dynamic-group dg-cloud-resume to use ons-topics in tenancy`

If you prefer to scope to a specific compartment:
	- `allow dynamic-group dg-cloud-resume to read object-family in compartment <compartment-name>`
	- `allow dynamic-group dg-cloud-resume to use ons-topics in compartment <compartment-name>`

Note: `use ons-topics` covers publishing messages to Notifications topics.

## GitHub Actions (Daily Trigger)
Add a workflow file `.github/workflows/daily-report.yml` in this repo with a scheduled run. Set repo secrets:
- `REPORT_URL` – your API Gateway report URL, e.g. `https://<gw>/report`
- `REPORT_TOKEN` – the same token you set in Function config

The workflow will call `GET ${REPORT_URL}?token=${REPORT_TOKEN}` once per day to trigger the email.
