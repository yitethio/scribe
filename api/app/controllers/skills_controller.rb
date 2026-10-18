class SkillsController < ApplicationController
  before_action :set_skill, only: %i[ show update ]

  def index
    @skills = Current.user.skills.order(:id)
  end

  def show
  end

  def update
    @skill.update!(params.permit(:name, :score))
    head :no_content
  end

  private
    def set_skill
      @skill = Current.user.skills.find(params[:id])
    end
end
