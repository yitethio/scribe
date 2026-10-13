class Revisions::AttemptsController < ApplicationController
  before_action :set_revision

  def index
    @attempts = @revision.attempts.where(user: Current.user).order(created_at: :desc)
  end

  def create
    @attempt = @revision.attempts.new(user: Current.user, text: params.require(:text))
    @attempt.grade
    @attempt.save!
    render :show, status: :created
  end

  private
    def set_revision
      @revision = Revision.find(params[:revision_id])
    end
end
