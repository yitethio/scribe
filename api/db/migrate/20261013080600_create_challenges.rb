class CreateChallenges < ActiveRecord::Migration[8.1]
  def change
    create_table :challenges do |t|
      t.string :title, null: false
      t.text :theme, null: false
      t.json :words, null: false, default: []
      t.integer :target_count, null: false
      t.datetime :starts_at, null: false
      t.datetime :due_at, null: false

      t.timestamps
    end

    create_table :challenge_submissions do |t|
      t.references :challenge, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :passage, null: false
      t.integer :word_count, null: false, default: 0
      t.json :rubric, null: false, default: []

      t.timestamps
    end
    add_index :challenge_submissions, %i[ challenge_id user_id ], unique: true
  end
end
