# Lets the scribe frontend call the API from the browser.
# Set CORS_ORIGINS to a comma-separated list of allowed origins in production.
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("CORS_ORIGINS", "http://localhost:5173").split(",").map(&:strip)

    resource "*",
      headers: :any,
      expose: %w[ Location ],
      methods: %i[ get post put patch delete options head ]
  end
end
