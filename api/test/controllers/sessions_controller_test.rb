require "test_helper"

class SessionsControllerTest < ActionDispatch::IntegrationTest
  test "create with valid credentials returns a token" do
    post session_path, params: { email_address: "alex@example.com", password: "password" }, as: :json

    assert_response :created
    assert_equal users(:alex).sessions.last.token, json["token"]
    assert_equal "Alex Rivera", json.dig("user", "name")
  end

  test "create with invalid credentials" do
    post session_path, params: { email_address: "alex@example.com", password: "wrong" }, as: :json

    assert_response :unauthorized
  end

  test "destroy ends the session" do
    assert_difference -> { users(:alex).sessions.count }, -1 do
      delete session_path, headers: auth_headers
    end

    assert_response :no_content
  end

  test "requests without a token are rejected" do
    delete session_path

    assert_response :unauthorized
  end
end
