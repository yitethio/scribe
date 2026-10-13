require "test_helper"

class PasswordsControllerTest < ActionDispatch::IntegrationTest
  include ActionMailer::TestHelper

  test "create emails a reset link" do
    assert_enqueued_email_with PasswordsMailer, :reset, args: [ users(:alex) ] do
      post passwords_path, params: { email_address: "alex@example.com" }, as: :json
    end

    assert_response :accepted
  end

  test "create doesn't reveal whether an account exists" do
    assert_no_enqueued_emails do
      post passwords_path, params: { email_address: "nobody@example.com" }, as: :json
    end

    assert_response :accepted
  end

  test "update sets the new password and signs out everywhere" do
    user = users(:alex)

    patch password_path(user.password_reset_token), params: { password: "brand new password" }, as: :json

    assert_response :no_content
    assert user.reload.authenticate("brand new password")
    assert_empty user.sessions
  end

  test "update works only once per token" do
    token = users(:alex).password_reset_token
    patch password_path(token), params: { password: "brand new password" }, as: :json

    patch password_path(token), params: { password: "another new password" }, as: :json

    assert_response :unprocessable_content
  end

  test "update with an invalid token" do
    patch password_path("nonsense"), params: { password: "brand new password" }, as: :json

    assert_response :unprocessable_content
    assert_match "invalid or has expired", json["error"]
  end

  test "update with a short password" do
    patch password_path(users(:alex).password_reset_token), params: { password: "short" }, as: :json

    assert_response :unprocessable_content
    assert json.dig("errors", "password").any?
  end
end
