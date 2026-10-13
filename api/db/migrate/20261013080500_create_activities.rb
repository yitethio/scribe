class CreateActivities < ActiveRecord::Migration[8.1]
  def change
    create_table :activities do |t|
      t.references :user, null: false, foreign_key: true
      t.references :subject, polymorphic: true
      t.string :kind, null: false
      t.string :title, null: false
      t.string :status
      t.integer :word_count, null: false, default: 0
      t.integer :vocabulary_added, null: false, default: 0
      t.integer :duration_minutes, null: false, default: 0
      t.datetime :occurred_at, null: false

      t.timestamps
    end
    add_index :activities, %i[ user_id occurred_at ]
  end
end
