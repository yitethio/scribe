# Scribe API

Rails 8 JSON API for the scribe writing coach: accounts, vocabulary with spaced practice, book sessions,
drafts with coach issues, weekly challenges, the revision lab, and the activity log behind the dashboard stats.

Written in vanilla Rails, 37signals style: REST resources only, logic in models and concerns, state as
records (a resolved coach issue has a `resolution`), SQLite, Minitest with fixtures.

## Run it

Requires Ruby 3.3.6.

```sh
cd api
bundle install
bin/rails db:prepare db:seed   # loads the frontend's sample data
bin/rails server               # http://localhost:3000
```

Sign in as `demo@scribe.test` / `password123`, or sign up with `POST /registration`.

```sh
curl -X POST localhost:3000/session -H 'Content-Type: application/json' \
  -d '{"email_address":"demo@scribe.test","password":"password123"}'
# => {"token":"...","user":{...}}

curl localhost:3000/profile -H 'Authorization: Bearer <token>'
```

## Docs

- Browse the API at http://localhost:3000/docs
- The spec is [`public/openapi.yaml`](public/openapi.yaml) (OpenAPI 3.1), served at `/openapi.yaml`

The tests check every response against the spec and check that the spec lists exactly the app's routes,
so a change to the API that isn't reflected in the spec fails the build.

## Test

```sh
bin/rails test
bin/rubocop
```

## Configuration

| Variable | Purpose | Default |
|---|---|---|
| `CORS_ORIGINS` | Comma-separated origins allowed to call the API from a browser | `http://localhost:5173` |
| `SECRET_KEY_BASE` | Required in production | |
| `FRONTEND_URL` | Password reset emails link to `FRONTEND_URL/reset-password?token=...` | `http://localhost:5173` |
| `MAILER_FROM` | Sender of password reset emails | `Scribe <no-reply@scribe.test>` |
| `SMTP_ADDRESS`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` | Mail server in production | port `587` |

## Not included yet

- AI features. The coach issues, challenge rubric and definitions can be written through the API, but
  nothing generates them. Challenge scoring and revision grading are simple word matching.
- Admin endpoints. Challenges and revision exercises are shared by all users and are created with seeds
  or the Rails console.
