Rails.application.routes.draw do
  resource :registration, only: :create
  resource :session, only: %i[ create destroy ]
  resources :passwords, param: :token, only: %i[ create update ]
  resource :profile, only: %i[ show update ]

  resources :skills, only: %i[ index show update ] do
    resource :focus, only: :create, module: :skills, controller: :focuses
  end

  resources :vocabulary_words do
    scope module: :vocabulary_words do
      resources :reviews, only: %i[ index create ]
      resource :definition_check, only: :create
    end
  end

  resources :book_sessions do
    scope module: :book_sessions do
      resources :pages, only: %i[ index show update ], param: :number
      resources :words, only: %i[ index create destroy ]
    end
  end

  resources :drafts do
    resource :coaching, only: :create, module: :drafts
    resources :coach_issues, shallow: true do
      resource :resolution, only: %i[ create destroy ], module: :coach_issues
    end
  end

  resources :challenges, only: %i[ index show ] do
    resource :submission, only: %i[ show create ], module: :challenges
  end

  resources :revisions, only: %i[ index show ] do
    resources :attempts, only: %i[ index create ], module: :revisions
  end

  resources :activities, only: %i[ index create ]

  namespace :admin do
    resources :challenges, :revisions
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
