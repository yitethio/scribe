require "json_schemer"

# Checks every integration test response against public/openapi.yaml, so the spec can't drift from the API.
module OpenapiTestHelper
  SPEC = YAML.safe_load_file(Rails.root.join("public/openapi.yaml"))
  SCHEMER = JSONSchemer.openapi(SPEC)
  PATHS = SPEC["paths"].keys.index_by { |path| Regexp.new("\\A#{path.gsub(/\{[^}]+\}/, "[^/]+")}\\z") }

  %i[ get post patch put delete ].each do |verb|
    define_method(verb) do |*args, **options|
      super(*args, **options).tap { assert_response_matches_openapi }
    end
  end

  def assert_response_matches_openapi
    path = PATHS.find { |pattern, _| pattern.match?(request.path) }&.last
    assert path, "#{request.path} is not in the OpenAPI spec"

    operations = SPEC.dig("paths", path)
    verb = request.method.downcase
    verb = (operations.keys & %w[ patch put ]).first if verb.in?(%w[ patch put ])
    assert operations.key?(verb), "#{request.method} #{path} is not in the OpenAPI spec"

    pointer = "#/" + [ "paths", path, verb, "responses", response.status.to_s ].map { |key| escape_pointer(key) }.join("/")
    documented = SPEC.dig("paths", path, verb, "responses", response.status.to_s)
    assert documented, "#{request.method} #{path} returned #{response.status}, which the OpenAPI spec doesn't document"
    pointer = documented["$ref"] if documented.key?("$ref")

    if response.body.present?
      errors = SCHEMER.ref("#{pointer}/content/application~1json/schema").validate(response.parsed_body).map { |error| error["error"] }
      assert_empty errors, "#{request.method} #{path} #{response.status} doesn't match the OpenAPI spec"
    end
  end

  private
    def escape_pointer(key)
      ERB::Util.url_encode(key.gsub("~", "~0").gsub("/", "~1"))
    end
end

ActiveSupport.on_load(:action_dispatch_integration_test) do
  prepend OpenapiTestHelper
end
