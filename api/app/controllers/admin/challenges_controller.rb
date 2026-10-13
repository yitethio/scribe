class Admin::ChallengesController < ApplicationController
  require_admin
  before_action :set_challenge, only: %i[ show update destroy ]

  def index
    @challenges = Challenge.reverse_chronologically
  end

  def show
  end

  def create
    @challenge = Challenge.create!(challenge_params)
    render :show, status: :created, location: [ :admin, @challenge ]
  end

  def update
    @challenge.update!(challenge_params)
    head :no_content
  end

  def destroy
    @challenge.destroy
    head :no_content
  end

  private
    def set_challenge
      @challenge = Challenge.find(params[:id])
    end

    def challenge_params
      params.permit(:title, :theme, :target_count, :starts_at, :due_at, words: [])
    end
end
