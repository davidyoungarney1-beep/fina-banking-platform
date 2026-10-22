# FINA frontend/backend integration contract

The static frontend is prepared for a backend, but it is not a live financial service until the backend is deployed, tested, and configured.

## Configuration
Set `window.FINA_CONFIG.API_BASE_URL` in `config.js` to the backend origin. Do not place passwords, private API keys, database credentials, or payment-provider secrets in frontend files.

The frontend uses cookie-based sessions. The backend should set the session cookie with `HttpOnly`, `Secure` in production, and an appropriate `SameSite` policy. For cross-origin deployments, configure CORS for the exact frontend origin and allow credentials. Do not return long-lived session tokens for JavaScript to store.

## Endpoints expected by the frontend

- `POST /api/auth/register` — JSON: `fullName`, `email`, `phone`, `password`. Return success only after the account is created. Optional `bonusCredited: true` and `bonusAmount` are shown in the welcome popup only if the amount has actually been credited to the account ledger.
- `POST /api/auth/login` — JSON: `email`, `password`; establish the session cookie.
- `POST /api/auth/logout` — invalidate the session.
- `POST /api/auth/forgot-password` — JSON: `email`; respond safely without revealing whether an account exists.
- `GET /api/dashboard` — authenticated. Return `user` or `account`, `balance` (or `user.walletBalance`), and `transactions` or `recentActivity`.
- `POST /api/withdrawal/request` — authenticated. JSON: `amount`, `bankName`, `accountName`, `accountNumber`.
- `POST /api/activation/proof` — authenticated multipart form data: `paymentReference`, `proofFile`.
- `POST /api/services/airtime` — authenticated JSON: `network`, `phoneNumber`, `amount`.
- `POST /api/services/data` — authenticated JSON: `network`, `phoneNumber`, `bundle`, `amount`.
- `POST /api/services/betting` — authenticated JSON: `operator`, `customerId`, `amount`.

## Required server-side controls

Validate every request on the server. Never trust amounts, account balances, activation status, payment receipts, bonus eligibility, or transaction success from the browser. Use server-side ledger updates and idempotency protections; verify payment with the provider or through a controlled reconciliation workflow; apply rate limits and CSRF protection appropriate to cookie sessions; restrict uploaded file types/size and store receipts privately. Return a clear JSON `message` for success and errors, with proper HTTP status codes. The frontend does not fake transaction success when the API is absent or returns an error.
