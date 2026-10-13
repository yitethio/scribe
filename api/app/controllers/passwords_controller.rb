class PasswordsController < ApplicationController
  allow_unauthenticated_access
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { render json: { error: "Try again later." }, status: :too_many_requests }

  before_action :set_user_by_token, only: :update

  def create
    if user = User.find_by(email_address: params.require(:email_address))
      PasswordsMailer.reset(user).deliver_later
    end

    head :accepted
  end

  def update
    @user.reset_password_to params.require(:password)
    head :no_content
  end

  private
    def set_user_by_token
      @user = User.find_by_password_reset_token!(params[:token])
    rescue ActiveSupport::MessageVerifier::InvalidSignature
      render json: { error: "That password reset link is invalid or has expired." }, status: :unprocessable_content
    end
end
