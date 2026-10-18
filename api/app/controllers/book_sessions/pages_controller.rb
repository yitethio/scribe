class BookSessions::PagesController < ApplicationController
  before_action :set_book_session

  def index
    @pages = @book_session.pages
  end

  def show
    @page = @book_session.pages.find_by!(number: params[:number])
  end

  def update
    @page = @book_session.pages.find_or_initialize_by(number: params[:number])
    @page.update!(params.permit(:chapter, :subhead, paragraphs: []))
    head :no_content
  end

  private
    def set_book_session
      @book_session = Current.user.book_sessions.find(params[:book_session_id])
    end
end
