class VocabularyWordsController < ApplicationController
  before_action :set_vocabulary_word, only: %i[ show update destroy ]

  def index
    @vocabulary_words = Current.user.vocabulary_words.reverse_chronologically
    @vocabulary_words = @vocabulary_words.where(status: params[:status]) if params[:status].present?
    @vocabulary_words = @vocabulary_words.matching(params[:q]) if params[:q].present?
  end

  def show
  end

  def create
    @vocabulary_word = Current.user.vocabulary_words.create!(vocabulary_word_params)
    render :show, status: :created, location: @vocabulary_word
  end

  def update
    @vocabulary_word.update!(vocabulary_word_params)
    head :no_content
  end

  def destroy
    @vocabulary_word.destroy
    head :no_content
  end

  private
    def set_vocabulary_word
      @vocabulary_word = Current.user.vocabulary_words.find(params[:id])
    end

    def vocabulary_word_params
      params.permit(:word, :part_of_speech, :personal_definition, :definition, :example, :context_sentence,
        :status, :confidence, :learned_on, collocations: [], synonyms: [])
    end
end
