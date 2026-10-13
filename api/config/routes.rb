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

    resources :book_sessions do
      scope module: :book_sessions do
        resources :pages, only: %i[ index show update ], param: :number
        resources :words, only: %i[ index create destroy ]
      end
    end

    resources :drafts do
      resources :coach_issues, shallow: true do
        resource :resolution, only: %i[ create destroy ], module: :coach_issues
      end
    end

    resources :activities, only: %i[ index create ]
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
