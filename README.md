# FINA Banking Platform

FINA is a mobile-friendly banking-style web prototype. This private repository consolidates the current landing page and wallet dashboard with the planned backend foundation.

## Current status
- `index.html`, `style.css`, `app.js`: landing-page prototype.
- `dashboard.html`, `dashboard.css`, `dashboard.js`: wallet dashboard and local-only demo interactions.
- `backend/`: initial API scaffold; it does not move money or store real accounts yet.
- `docs/PRODUCT_REQUIREMENTS.md`: planned features and safeguards.

## Run the frontend locally
Open `index.html` in a browser, or serve the repository root with any static web server. The wallet page is `dashboard.html`. Current forms and withdrawal actions are demos only; they do not create real accounts, submit bank details, or transfer money.

## Run the backend scaffold
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
The only endpoint currently implemented is `GET /api/health`. Do not enter real customer information.

## Financial-product integrity and security
- Promotional credit must be clearly distinguished from cash held in a real, funded wallet. Do not promise withdrawals unless the funds and withdrawal process are real and available under published terms.
- Any activation or maintenance charge must state its genuine purpose, recipient, eligibility rules, and refund terms before payment.
- Before production, add audited authentication, server-side authorization, a durable database, ledger-based balance accounting, idempotent payment/withdrawal processing, monitoring, and provider integrations. Never trust balances or activation status supplied by the browser.
- Do not commit `.env`, access tokens, private keys, or customer data.

## Project structure
```text
.
├── index.html / style.css / app.js
├── dashboard.html / dashboard.css / dashboard.js
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/server.js
└── docs/PRODUCT_REQUIREMENTS.md
```