class CreateBookSessions < ActiveRecord::Migration[8.1]
  def change
    create_table :book_sessions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :book_title, null: false
      t.string :author
      t.string :cover_url
      t.string :filename
      t.integer :current_page, null: false, default: 1
      t.integer :total_pages
      t.integer :zoom_level, null: false, default: 100
      t.integer :words_rewritten, null: false, default: 0
      t.integer :duration_seconds, null: false, default: 0
      t.text :draft_text

      t.timestamps
    end

    create_table :book_session_pages do |t|
      t.references :book_session, null: false, foreign_key: true
      t.integer :number, null: false
      t.string :chapter
      t.string :subhead
      t.json :paragraphs, null: false, default: []

      t.timestamps
    end
    add_index :book_session_pages, %i[ book_session_id number ], unique: true

    create_table :book_session_words do |t|
      t.references :book_session, null: false, foreign_key: true
      t.references :vocabulary_word, null: false, foreign_key: true

      t.timestamps
    end
    add_index :book_session_words, %i[ book_session_id vocabulary_word_id ], unique: true
  end
end
