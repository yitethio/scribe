Rails.application.routes.draw do
  resource :registration, only: :create
  resource :session, only: %i[ create destroy ]

  get "up" => "rails/health#show", as: :rails_health_check
end
