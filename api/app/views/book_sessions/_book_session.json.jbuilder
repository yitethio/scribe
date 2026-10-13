json.extract! book_session, :id, :book_title, :author, :cover_url, :filename, :current_page, :total_pages,
  :zoom_level, :words_rewritten, :duration_seconds, :draft_text, :created_at, :updated_at
json.words book_session.vocabulary_words.pluck(:word)
