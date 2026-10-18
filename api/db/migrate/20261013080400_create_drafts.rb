class CreateDrafts < ActiveRecord::Migration[8.1]
  def change
    create_table :drafts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :body
      t.boolean :coach_enabled, null: false, default: true
      t.string :coach_level, null: false, default: "guided"

      t.timestamps
    end

    create_table :coach_issues do |t|
      t.references :draft, null: false, foreign_key: true
      t.string :phrase, null: false
      t.string :category, null: false
      t.string :category_color
      t.string :badge
      t.text :summary
      t.text :question
      t.text :hint
      t.text :explanation
      t.text :sample_fix

      t.timestamps
    end

    create_table :coach_issue_resolutions do |t|
      t.references :coach_issue, null: false, foreign_key: true, index: { unique: true }
      t.text :revision

      t.timestamps
    end
  end
end
