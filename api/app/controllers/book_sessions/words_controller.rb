class BookSessions::WordsController < ApplicationController
  before_action :set_book_session

  def index
    @vocabulary_words = @book_session.vocabulary_words
  end

  def create
    @vocabulary_word = @book_session.capture(params.require(:word), context_sentence: params[:context_sentence])
    render "vocabulary_words/show", status: :created, location: @vocabulary_word
  end

  def destroy
    @book_session.words.find_by!(vocabulary_word_id: params[:id]).destroy
    head :no_content
  end

  private
    def set_book_session
      @book_session = Current.user.book_sessions.find(params[:book_session_id])
    end
end
