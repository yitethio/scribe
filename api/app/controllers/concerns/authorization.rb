module Authorization
  extend ActiveSupport::Concern

  class_methods do
    def require_admin(**options)
      before_action :ensure_admin, **options
    end
  end

  private
    def ensure_admin
      render json: { error: "Only admins can do that." }, status: :forbidden unless Current.user.admin?
    end
end
