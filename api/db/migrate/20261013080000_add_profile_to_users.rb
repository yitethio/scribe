class AddProfileToUsers < ActiveRecord::Migration[8.1]
  def change
    change_table :users do |t|
      t.string :role_title
      t.string :level
      t.integer :weekly_goal, null: false, default: 5000
      t.string :focus_title
      t.text :focus_description
      t.text :focus_recommendation
    end
  end
end
