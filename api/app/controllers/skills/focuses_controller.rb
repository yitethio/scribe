class Skills::FocusesController < ApplicationController
  def create
    Current.user.skills.find(params[:skill_id]).focus
    head :no_content
  end
end
