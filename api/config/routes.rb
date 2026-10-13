Rails.application.routes.draw do
  defaults format: :json do
    resource :registration, only: :create
    resource :session, only: %i[ create destroy ]
    resource :profile, only: %i[ show update ]

    resources :skills, only: %i[ index show update ] do
      resource :focus, only: :create, module: :skills, controller: :focuses
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
