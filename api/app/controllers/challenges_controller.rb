class ChallengesController < ApplicationController
  def index
    @challenges = Challenge.reverse_chronologically
    @challenges = @challenges.current if params[:current] == "true"
  end

  def show
    @challenge = Challenge.find(params[:id])
  end
end
