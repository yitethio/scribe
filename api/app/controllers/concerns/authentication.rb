module Authentication
  extend ActiveSupport::Concern
  include ActionController::HttpAuthentication::Token::ControllerMethods

  included do
    before_action :require_authentication
  end

  class_methods do
    def allow_unauthenticated_access(**options)
      skip_before_action :require_authentication, **options
    end
  end

  private
    def require_authentication
      resume_session || request_authentication
    end

    def resume_session
      Current.session ||= authenticate_with_http_token { |token| Session.find_by(token: token) }
    end

    def request_authentication
      render json: { error: "Sign in with a valid bearer token." }, status: :unauthorized
    end

    def start_new_session_for(user)
      Current.session = user.sessions.create!(user_agent: request.user_agent, ip_address: request.remote_ip)
    end

    def terminate_session
      Current.session.destroy
    end
end
