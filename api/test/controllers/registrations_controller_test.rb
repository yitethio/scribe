require "test_helper"

class RegistrationsControllerTest < ActionDispatch::IntegrationTest
  test "create signs up and returns a token" do
    assert_difference -> { User.count } do
      post registration_path, params: { name: "Mira", email_address: "Mira@Example.com", password: "long enough" }, as: :json
    end

    assert_response :created
    assert json["token"].present?
    assert_equal "mira@example.com", json.dig("user", "email_address")
  end

  test "create rejects a taken email address" do
    post registration_path, params: { name: "Alex", email_address: "alex@example.com", password: "long enough" }, as: :json

    assert_response :unprocessable_content
    assert json.dig("errors", "email_address").present?
  end
end
