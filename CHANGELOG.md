# Changelog

All notable changes to eterpost-sorter. Versions follow [Semantic Versioning](https://semver.org/);
before 1.0 a minor version brings new features and a patch version brings fixes.

## 0.3.0 — 2026-11-10

The first tagged release under the Eterpost organization.

- The unsubscribe address may carry the mailing number: `<user>+unsubscribe-<number>@…`.
  The number is passed to eterpost-server, which then unsubscribes the address only within
  the space of that mailing. The plain `<user>+unsubscribe@…` keeps unsubscribing from all.
- Delivery errors are recorded in the list of their mailing.
- Rejections are recognised as spam by a configurable set of patterns (`spamPatterns`).
- Letters from people are forwarded with the original message attached.
- The mailing of a delivery error is remembered in address statistics.
- An API key is sent to eterpost-server; the EHLO name of the SMTP server is configurable.
- Every run's result is saved to Redis (shown in the eterpost-server web client).
- Unsubscribe by mail only affects mailings with List-Unsubscribe.
- List-Id is read from the raw header.
- Modernized for Node.js 22; Dockerfile.

## 0.2.0

The original Etersoft mail-sorter (2018–2020).
