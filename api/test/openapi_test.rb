require "test_helper"

class OpenapiTest < ActiveSupport::TestCase
  test "the spec is a valid OpenAPI 3.1 document" do
    assert_empty OpenapiTestHelper::SCHEMER.validate.map { |error| error["error"] }
  end

  test "the spec documents every route, and nothing else" do
    routes = Rails.application.routes.routes.filter_map do |route|
      next unless route.defaults[:controller].present? && route.verb.present?
      next if route.defaults[:controller].start_with?("rails/")
      next if route.verb == "PUT" && route.defaults[:action] == "update" && route.defaults[:controller] != "book_sessions/pages"
      next if route.verb == "PATCH" && route.defaults[:controller] == "book_sessions/pages"

      "#{route.verb} #{route.path.spec.to_s.delete_suffix("(.:format)").gsub(/:(\w+)/, '{\1}')}"
    end

    documented = OpenapiTestHelper::SPEC["paths"].flat_map do |path, operations|
      (operations.keys & %w[ get post put patch delete ]).map { |verb| "#{verb.upcase} #{path}" }
    end

    assert_equal routes.sort, documented.sort
  end
end
