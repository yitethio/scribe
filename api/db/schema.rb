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

ActiveRecord::Schema[8.1].define(version: 2026_10_13_080200) do
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
    t.index ["user_id", "word"], name: "index_vocabulary_words_on_user_id_and_word", unique: true
    t.index ["user_id"], name: "index_vocabulary_words_on_user_id"
  end

  add_foreign_key "sessions", "users"
  add_foreign_key "skills", "users"
  add_foreign_key "users", "skills", column: "focused_skill_id"
  add_foreign_key "vocabulary_word_reviews", "vocabulary_words"
  add_foreign_key "vocabulary_words", "users"
end
