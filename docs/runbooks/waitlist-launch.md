# Waitlist + Closed-Allowlist Launch Runbook

Manual setup steps to bring the new landing + waitlist + Clerk allowlist gate live on `draftcrane.app`. Code is in PR; this is the operator checklist.

## 1. Clerk Pro upgrade (required for Allowlist)

Restricted Mode + Allowlist are paid features in production (free in dev). Pro is **$25/mo flat for unlimited apps** — covers DC, KE, DFG, SC.

- https://dashboard.clerk.com → DraftCrane app → Billing → upgrade to Pro
- Settings → Restrictions → enable **Allowlist mode** (Sign-up restrictions: "Allowlist only")
- Allowlist → add `smdurgan@venturecrane.com` + any test invitees
- Settings → Email & SMS → Magic link → enable as primary sign-in method
- Customize the magic-link email template (sender: `hello@mail.draftcrane.app`, body styled to brand voice)

## 2. Resend domain verification

We send from a `mail.<apex>` subdomain so the apex's MX/SPF/DKIM/DMARC stays untouched.

- https://resend.com/domains → Add domain → `mail.draftcrane.app`
- Resend issues SPF + DKIM TXT records and a DMARC record. Add them to `draftcrane.app` DNS (Cloudflare).
- Wait for `Verified` (usually < 5 min).
- Create an API key scoped to `mail.draftcrane.app` with `send` permission.
- Save key as `RESEND_API_KEY` in Infisical `/dc`.

## 3. Cloudflare Turnstile

Anti-abuse widget on the waitlist form.

- https://dash.cloudflare.com → Turnstile → Add site
- Site name: `draftcrane.app waitlist`
- Domain: `draftcrane.app`
- Widget mode: **Managed** (default)
- Save site key (public) and secret key (server-side).
- Save `TURNSTILE_SECRET_KEY` in Infisical `/dc`.

## 4. Worker secrets

```bash
cd workers/dc-api
infisical run --env=prod --path=/dc -- bash -c '
  echo "$RESEND_API_KEY" | wrangler secret put RESEND_API_KEY
  echo "$TURNSTILE_SECRET_KEY" | wrangler secret put TURNSTILE_SECRET_KEY
'
```

## 5. Vercel env var (Turnstile site key)

The site key is public (it appears in the rendered widget); fine to commit to Vercel.

- Vercel project `dc-console` → Settings → Environment Variables
- Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` for Production + Preview
- Trigger a redeploy

## 6. D1 migration

```bash
cd workers/dc-api
npm run db:migrate:remote   # applies 0029_create_waitlist_signups.sql to dc-main
```

## 7. End-to-end verification

1. Visit https://draftcrane.app — landing renders, six sections present, brand-correct.
2. Submit waitlist with a test email → success state appears.
3. Confirmation email arrives in test inbox (check Gmail + iCloud + Workspace if you have them).
4. Captain notification email arrives at `smdurgan@venturecrane.com`.
5. Submit the same email again → "you are already on the list" state (no duplicate row, no second email).
6. Open browser devtools, forge a Turnstile token → form submission rejected (400 TURNSTILE_FAILED).
7. Visit `/sign-in` with an allowlisted email → magic link arrives → click-through completes sign-in → lands on dashboard.
8. Visit `/sign-in` with a non-allowlisted email → blocked at Clerk with clear message.
9. Visit a gated route (e.g. `/dashboard`) signed-out → redirect to `/sign-in`.
10. Tail the worker:
    ```bash
    cd workers/dc-api && wrangler tail
    ```
    Submit another signup. Confirm a structured `waitlist_signup` log line appears.

## 8. Reviewing waitlist signups

```bash
cd workers/dc-api
wrangler d1 execute dc-main --remote --command \
  "SELECT id, email, signed_up_at, status, utm_source, ip_country FROM waitlist_signups ORDER BY signed_up_at DESC LIMIT 50"
```

To promote a signup to allowlist: copy the email, paste into Clerk Allowlist, mark the row as `invited`:

```bash
wrangler d1 execute dc-main --remote --command \
  "UPDATE waitlist_signups SET status = 'invited' WHERE email = 'foo@example.com'"
```
