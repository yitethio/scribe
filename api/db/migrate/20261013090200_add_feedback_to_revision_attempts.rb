class AddFeedbackToRevisionAttempts < ActiveRecord::Migration[8.1]
  def change
    add_column :revision_attempts, :feedback, :text
  end
end
