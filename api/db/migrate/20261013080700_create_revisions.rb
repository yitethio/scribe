class CreateRevisions < ActiveRecord::Migration[8.1]
  def change
    create_table :revisions do |t|
      t.text :original, null: false
      t.string :focus_segment, null: false
      t.string :category, null: false
      t.text :prompt, null: false
      t.string :expected_keyword, null: false
      t.text :hint
      t.text :explanation

      t.timestamps
    end

    create_table :revision_attempts do |t|
      t.references :revision, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :text, null: false
      t.boolean :correct, null: false

      t.timestamps
    end
    add_index :revision_attempts, %i[ user_id revision_id correct ]
  end
end
