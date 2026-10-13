class Challenges::SubmissionsController < ApplicationController
  before_action :set_challenge

  def show
    @submission = @challenge.submissions.find_by!(user: Current.user)
  end

  def create
    if @challenge.open?
      @submission = @challenge.submissions.find_or_initialize_by(user: Current.user)
      @submission.submit params.require(:passage)
      render :show, status: :created
    else
      render json: { error: "This challenge is closed." }, status: :unprocessable_content
    end
  end

  private
    def set_challenge
      @challenge = Challenge.find(params[:challenge_id])
    end
end
