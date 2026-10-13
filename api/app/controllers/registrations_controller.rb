class RegistrationsController < ApplicationController
  allow_unauthenticated_access only: :create
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { render json: { error: "Try again later." }, status: :too_many_requests }

  def create
    start_new_session_for User.create!(user_params)
    render "sessions/show", status: :created
  end

  private
    def user_params
      params.permit(:name, :email_address, :password)
    end
end
