class VocabularyWords::ReviewsController < ApplicationController
  before_action :set_vocabulary_word

  def index
    @reviews = @vocabulary_word.reviews.order(created_at: :desc)
  end

  def create
    @review = @vocabulary_word.reviews.create!(params.permit(:kind, :sentence, :correct))
    render :show, status: :created
  end

  private
    def set_vocabulary_word
      @vocabulary_word = Current.user.vocabulary_words.find(params[:vocabulary_word_id])
    end
end
