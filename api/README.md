# Scribe API

Rails 8 JSON API for the scribe writing coach: accounts, vocabulary with spaced practice, book sessions,
drafts with coach issues, weekly challenges, the revision lab, and the activity log behind the dashboard stats.
Claude coaches drafts and grades the learner's writing, password resets go out by email, and admins manage
the shared challenges and revision exercises.

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

Sign in as `demo@scribe.test` / `password123`, or sign up with `POST /registration`. In development,
password reset emails aren't sent; the reset link shows up in `log/development.log`.

The demo account is an admin, so it can manage the shared challenges and revision exercises under
`/admin/challenges` and `/admin/revisions`. Make someone else an admin from the console:

```sh
bin/rails runner 'User.find_by!(email_address: "kim@example.com").update!(admin: true)'
```

```sh
curl -X POST localhost:3000/session -H 'Content-Type: application/json' \
  -d '{"email_address":"demo@scribe.test","password":"password123"}'
# => {"token":"...","user":{...}}

curl localhost:3000/profile -H 'Authorization: Bearer <token>'
```

## AI

Claude reads the learner's work through [RubyLLM](https://rubyllm.com) agents in `app/agents`, with their
prompts in `app/prompts`:

| Feature | Endpoint | Agent |
|---|---|---|
| Check a learner's own definition of a word | `POST /vocabulary_words/{id}/definition_check` | `DefinitionChecker` |
| Coach a draft at its coaching level | `POST /drafts/{id}/coaching` | `WritingCoach` |
| Grade a challenge passage word by word | `POST /challenges/{id}/submission` | `ChallengeGrader` |
| Judge a revision lab rewrite | `POST /revisions/{id}/attempts` | `RevisionGrader` |
| Judge a vocabulary usage sentence | `POST /vocabulary_words/{id}/reviews` | `UsageGrader` |

The rule from the frontend holds on the server: the AI never writes the learner's sentences. Every prompt
starts from `app/prompts/shared/_ground_rules.txt.erb`, and `LearnerText` drops any field of an answer that
reproduces one of the learner's sentences with edits before it's saved.

Claude is the default, but any RubyLLM provider with structured output works: set `SCRIBE_AI_PROVIDER`
(and `SCRIBE_AI_MODEL` if needed) plus that provider's key, e.g. `SCRIBE_AI_PROVIDER=gemini GEMINI_API_KEY=...`.

Without an API key, or when the provider is down, coaching and definition checks return `503`, and the
three graders fall back to the old word matching. Tests never call Claude: an agent raises
`ApplicationAgent::Unavailable` unless the test gives it an answer with `answer WritingCoach, with: {...}`.

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
| `SCRIBE_AI_PROVIDER` | Which RubyLLM provider the agents use: `anthropic`, `gemini`, `openai`, ... | `anthropic` |
| `SCRIBE_AI_MODEL` | Model the agents use. Required for providers other than `anthropic` and `gemini` | `claude-opus-5-5`, or `gemini-pro-latest` with Gemini |
| `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY` | The key for the chosen provider. Without one, the AI features are off | |
| `FRONTEND_URL` | Password reset emails link to `FRONTEND_URL/reset-password?token=...` | `http://localhost:5173` |
| `MAILER_FROM` | Sender of password reset emails | `Scribe <no-reply@scribe.test>` |
| `SMTP_ADDRESS`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` | Mail server in production | port `587` |
