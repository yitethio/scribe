class VocabularyWords::DefinitionChecksController < ApplicationController
  def create
    @vocabulary_word = Current.user.vocabulary_words.find(params[:vocabulary_word_id])
    @vocabulary_word.check_definition
    render "vocabulary_words/show", status: :created
  end
end
