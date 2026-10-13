# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_10_13_090100) do
  create_table "activities", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "subject_type"
    t.integer "subject_id"
    t.string "kind", null: false
    t.string "title", null: false
    t.string "status"
    t.integer "word_count", default: 0, null: false
    t.integer "vocabulary_added", default: 0, null: false
    t.integer "duration_minutes", default: 0, null: false
    t.datetime "occurred_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["subject_type", "subject_id"], name: "index_activities_on_subject"
    t.index ["user_id", "occurred_at"], name: "index_activities_on_user_id_and_occurred_at"
    t.index ["user_id"], name: "index_activities_on_user_id"
  end

  create_table "book_session_pages", force: :cascade do |t|
    t.integer "book_session_id", null: false
    t.integer "number", null: false
    t.string "chapter"
    t.string "subhead"
    t.json "paragraphs", default: [], null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["book_session_id", "number"], name: "index_book_session_pages_on_book_session_id_and_number", unique: true
    t.index ["book_session_id"], name: "index_book_session_pages_on_book_session_id"
  end

  create_table "book_session_words", force: :cascade do |t|
    t.integer "book_session_id", null: false
    t.integer "vocabulary_word_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["book_session_id", "vocabulary_word_id"], name: "idx_on_book_session_id_vocabulary_word_id_82143ce6d5", unique: true
    t.index ["book_session_id"], name: "index_book_session_words_on_book_session_id"
    t.index ["vocabulary_word_id"], name: "index_book_session_words_on_vocabulary_word_id"
  end

  create_table "book_sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "book_title", null: false
    t.string "author"
    t.string "cover_url"
    t.string "filename"
    t.integer "current_page", default: 1, null: false
    t.integer "total_pages"
    t.integer "zoom_level", default: 100, null: false
    t.integer "words_rewritten", default: 0, null: false
    t.integer "duration_seconds", default: 0, null: false
    t.text "draft_text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_book_sessions_on_user_id"
  end

  create_table "challenge_submissions", force: :cascade do |t|
    t.integer "challenge_id", null: false
    t.integer "user_id", null: false
    t.text "passage", null: false
    t.integer "word_count", default: 0, null: false
    t.json "rubric", default: [], null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["challenge_id", "user_id"], name: "index_challenge_submissions_on_challenge_id_and_user_id", unique: true
    t.index ["challenge_id"], name: "index_challenge_submissions_on_challenge_id"
    t.index ["user_id"], name: "index_challenge_submissions_on_user_id"
  end

  create_table "challenges", force: :cascade do |t|
    t.string "title", null: false
    t.text "theme", null: false
    t.json "words", default: [], null: false
    t.integer "target_count", null: false
    t.datetime "starts_at", null: false
    t.datetime "due_at", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "coach_issue_resolutions", force: :cascade do |t|
    t.integer "coach_issue_id", null: false
    t.text "revision"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["coach_issue_id"], name: "index_coach_issue_resolutions_on_coach_issue_id", unique: true
  end

  create_table "coach_issues", force: :cascade do |t|
    t.integer "draft_id", null: false
    t.string "phrase", null: false
    t.string "category", null: false
    t.string "category_color"
    t.string "badge"
    t.text "summary"
    t.text "question"
    t.text "hint"
    t.text "explanation"
    t.text "sample_fix"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["draft_id"], name: "index_coach_issues_on_draft_id"
  end

  create_table "drafts", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "title", null: false
    t.text "body"
    t.boolean "coach_enabled", default: true, null: false
    t.string "coach_level", default: "guided", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_drafts_on_user_id"
  end

  create_table "revision_attempts", force: :cascade do |t|
    t.integer "revision_id", null: false
    t.integer "user_id", null: false
    t.text "text", null: false
    t.boolean "correct", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["revision_id"], name: "index_revision_attempts_on_revision_id"
    t.index ["user_id", "revision_id", "correct"], name: "index_revision_attempts_on_user_id_and_revision_id_and_correct"
    t.index ["user_id"], name: "index_revision_attempts_on_user_id"
  end

  create_table "revisions", force: :cascade do |t|
    t.text "original", null: false
    t.string "focus_segment", null: false
    t.string "category", null: false
    t.text "prompt", null: false
    t.string "expected_keyword", null: false
    t.text "hint"
    t.text "explanation"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "sessions", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "token", null: false
    t.string "ip_address"
    t.string "user_agent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["token"], name: "index_sessions_on_token", unique: true
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "skills", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "key", null: false
    t.string "name", null: false
    t.integer "score", default: 0, null: false
    t.integer "previous_score", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "key"], name: "index_skills_on_user_id_and_key", unique: true
    t.index ["user_id"], name: "index_skills_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email_address", null: false
    t.string "password_digest", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role_title"
    t.string "level"
    t.integer "weekly_goal", default: 5000, null: false
    t.string "focus_title"
    t.text "focus_description"
    t.text "focus_recommendation"
    t.integer "focused_skill_id"
    t.boolean "admin", default: false, null: false
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
    t.index ["focused_skill_id"], name: "index_users_on_focused_skill_id"
  end

  create_table "vocabulary_word_reviews", force: :cascade do |t|
    t.integer "vocabulary_word_id", null: false
    t.string "kind", null: false
    t.text "sentence"
    t.boolean "correct", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["vocabulary_word_id"], name: "index_vocabulary_word_reviews_on_vocabulary_word_id"
  end

  create_table "vocabulary_words", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "word", null: false
    t.string "part_of_speech", default: "noun", null: false
    t.text "personal_definition"
    t.text "definition"
    t.text "example"
    t.text "context_sentence"
    t.json "collocations", default: [], null: false
    t.json "synonyms", default: [], null: false
    t.string "status", default: "learning", null: false
    t.string "confidence", default: "medium", null: false
    t.integer "uses_count", default: 0, null: false
    t.integer "correct_uses_count", default: 0, null: false
    t.date "learned_on", null: false
    t.datetime "last_reviewed_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "definition_verdict"
    t.text "definition_feedback"
    t.datetime "definition_checked_at"
    t.index ["user_id", "word"], name: "index_vocabulary_words_on_user_id_and_word", unique: true
    t.index ["user_id"], name: "index_vocabulary_words_on_user_id"
  end

  add_foreign_key "activities", "users"
  add_foreign_key "book_session_pages", "book_sessions"
  add_foreign_key "book_session_words", "book_sessions"
  add_foreign_key "book_session_words", "vocabulary_words"
  add_foreign_key "book_sessions", "users"
  add_foreign_key "challenge_submissions", "challenges"
  add_foreign_key "challenge_submissions", "users"
  add_foreign_key "coach_issue_resolutions", "coach_issues"
  add_foreign_key "coach_issues", "drafts"
  add_foreign_key "drafts", "users"
  add_foreign_key "revision_attempts", "revisions"
  add_foreign_key "revision_attempts", "users"
  add_foreign_key "sessions", "users"
  add_foreign_key "skills", "users"
  add_foreign_key "users", "skills", column: "focused_skill_id", on_delete: :nullify
  add_foreign_key "vocabulary_word_reviews", "vocabulary_words"
  add_foreign_key "vocabulary_words", "users"
end
