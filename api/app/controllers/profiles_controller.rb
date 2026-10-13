class ProfilesController < ApplicationController
  def show
    @user = Current.user
  end

  def update
    Current.user.update!(profile_params)
    head :no_content
  end

  private
    def profile_params
      params.permit(:name, :role_title, :level, :weekly_goal, :focus_title, :focus_description, :focus_recommendation)
    end
end
