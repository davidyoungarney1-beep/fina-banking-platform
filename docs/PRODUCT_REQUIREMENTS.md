# FINA — Product Requirements (working draft)

## Product goal
Build a responsive banking-style interface with secure user accounts, a wallet ledger, withdrawal requests, activity history, and optional third-party service integrations.

## Current prototype only
The frontend is static. The ₦30,000 promotional figure is illustrative, activation-code entry is not verified, and withdrawal actions only demonstrate the interface. No real balance, bank transfer, payment, airtime, data, or betting transaction is connected.

## Planned modules
1. Authentication: secure registration, sign-in, email/phone verification, session management, account recovery.
2. Wallet: server-authoritative ledger and separate balance categories for funded cash, pending funds, and promotional/restricted credit.
3. Promotions: eligibility, opt-in, expiry, caps, funding source, and readable terms displayed before acceptance.
4. Activation/maintenance: explain the actual service supplied, fee recipient, amount, refund policy, and what the fee does not guarantee.
5. Withdrawals: validate account ownership and available funded balance on the server; status tracking and auditable records.
6. Services: integrate only licensed/authorized providers for airtime, data, or other supported services. Do not advertise unavailable services as active.
7. Admin and audit: least-privilege access, audit trail, fraud controls, and reconciliation.

## Required safety and engineering controls
- Never let the browser set its own wallet balance, role, activation state, or withdrawal eligibility.
- Never represent a simulated, unfunded, or restricted promotional credit as guaranteed withdrawable cash.
- Use an append-only ledger, database transactions, idempotency keys, and reconciliation for real money movement.
- Keep secrets out of Git; validate and rate-limit all public endpoints.
- Publish clear fees, eligibility, limits, service terms, complaints contact, and refund conditions before collecting money.
- Review applicable Nigerian financial, consumer-protection, privacy, and payment-provider requirements before launch.

## Acceptance criteria for production
- Tests prove unauthorized users cannot view or modify another user's records.
- Withdrawals can only use eligible, funded, server-calculated balances.
- Duplicate requests cannot double-debit or double-pay.
- Every wallet movement is traceable and reconciled.
- All service tiles accurately reflect available provider integrations.