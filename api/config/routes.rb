Rails.application.routes.draw do
  defaults format: :json do
    resource :registration, only: :create
    resource :session, only: %i[ create destroy ]
    resource :profile, only: %i[ show update ]

    resources :skills, only: %i[ index show update ] do
      resource :focus, only: :create, module: :skills, controller: :focuses
    end

    resources :vocabulary_words do
      resources :reviews, only: %i[ index create ], module: :vocabulary_words
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
