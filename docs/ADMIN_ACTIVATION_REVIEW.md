# FINA activation payment review — backend contract

The public activation page is `activation.html`. It displays the user's provided payment details (OPay, account name DAVID YOUNG, account number 9047782027) and submits the transaction reference plus receipt file.

## Customer submission
- `POST /api/activation/proof`
- Authentication: required; derive the customer identity from the authenticated server session, never from a client-supplied user ID.
- Content type: `multipart/form-data`
- Fields: `paymentReference` (required string), `proofFile` (required image/PDF, maximum 5 MB).
- Store the file in private storage, validate its MIME type and actual content, and persist a pending activation request. Return a truthful success response only after durable storage succeeds.
- Do not activate an account just because a receipt was uploaded.

## Admin review page
Frontend: `admin-activation.html` and `admin-activation.js`. Keep this page out of customer navigation. Hiding a link is not access control.

- `GET /api/admin/activation-requests?status=pending|approved|rejected` (omit status for all)
  - Admin-only. Returns `{ "requests": [{ "id": "...", "fullName": "...", "email": "...", "amount": 3000, "paymentReference": "...", "status": "pending", "createdAt": "...", "proofUrl": "..." }] }`.
  - The proof URL must be authenticated/short-lived or served through a protected admin endpoint; do not expose private receipt files publicly.
- `PATCH /api/admin/activation-requests/:id`
  - Admin-only JSON body: `{ "action": "approve" }` or `{ "action": "reject" }`.
  - Verify payment against the receiving account before approval. Make decisions auditable and idempotent. Approval should update activation status server-side only; never trust client-side status.
- Enforce admin role checks server-side on every endpoint, secure cookies, credentialed CORS restricted to the actual frontend origin, request validation, upload limits, rate limits, and audit logs.
- The frontend sends cookies using `credentials: "include"`. Set `window.FINA_CONFIG.API_BASE_URL` to the backend origin before deployment.
