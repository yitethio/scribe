class CreateSkills < ActiveRecord::Migration[8.1]
  def change
    create_table :skills do |t|
      t.references :user, null: false, foreign_key: true
      t.string :key, null: false
      t.string :name, null: false
      t.integer :score, null: false, default: 0
      t.integer :previous_score, null: false, default: 0

      t.timestamps
    end
    add_index :skills, %i[ user_id key ], unique: true

    add_reference :users, :focused_skill, foreign_key: { to_table: :skills }
  end
end
