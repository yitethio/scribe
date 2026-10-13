class AddDefinitionCheckToVocabularyWords < ActiveRecord::Migration[8.1]
  def change
    add_column :vocabulary_words, :definition_verdict, :string
    add_column :vocabulary_words, :definition_feedback, :text
    add_column :vocabulary_words, :definition_checked_at, :datetime
  end
end
