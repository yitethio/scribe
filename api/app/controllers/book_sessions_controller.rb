class BookSessionsController < ApplicationController
  before_action :set_book_session, only: %i[ show update destroy ]

  def index
    @book_sessions = Current.user.book_sessions.latest
  end

  def show
  end

  def create
    @book_session = Current.user.book_sessions.create!(book_session_params)
    render :show, status: :created, location: @book_session
  end

  def update
    @book_session.update!(book_session_params)
    head :no_content
  end

  def destroy
    @book_session.destroy
    head :no_content
  end

  private
    def set_book_session
      @book_session = Current.user.book_sessions.find(params[:id])
    end

    def book_session_params
      params.permit(:book_title, :author, :cover_url, :filename, :current_page, :total_pages, :zoom_level,
        :words_rewritten, :duration_seconds, :draft_text)
    end
end
