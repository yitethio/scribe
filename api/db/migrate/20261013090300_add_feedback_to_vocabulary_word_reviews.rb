class AddFeedbackToVocabularyWordReviews < ActiveRecord::Migration[8.1]
  def change
    add_column :vocabulary_word_reviews, :feedback, :text
  end
end
