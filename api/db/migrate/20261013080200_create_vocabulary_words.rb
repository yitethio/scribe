class CreateVocabularyWords < ActiveRecord::Migration[8.1]
  def change
    create_table :vocabulary_words do |t|
      t.references :user, null: false, foreign_key: true
      t.string :word, null: false
      t.string :part_of_speech, null: false, default: "noun"
      t.text :personal_definition
      t.text :definition
      t.text :example
      t.text :context_sentence
      t.json :collocations, null: false, default: []
      t.json :synonyms, null: false, default: []
      t.string :status, null: false, default: "learning"
      t.string :confidence, null: false, default: "medium"
      t.integer :uses_count, null: false, default: 0
      t.integer :correct_uses_count, null: false, default: 0
      t.date :learned_on, null: false
      t.datetime :last_reviewed_at

      t.timestamps
    end
    add_index :vocabulary_words, %i[ user_id word ], unique: true

    create_table :vocabulary_word_reviews do |t|
      t.references :vocabulary_word, null: false, foreign_key: true
      t.string :kind, null: false
      t.text :sentence
      t.boolean :correct, null: false

      t.timestamps
    end
  end
end
