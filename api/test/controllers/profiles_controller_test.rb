require "test_helper"

class ProfilesControllerTest < ActionDispatch::IntegrationTest
  test "show" do
    get profile_path, headers: auth_headers

    assert_response :success
    assert_equal "alex@example.com", json["email_address"]
    assert_equal 5000, json["weekly_goal"]
  end

  test "update" do
    patch profile_path, params: { weekly_goal: 6000, focus_title: "Cohesion" }, headers: auth_headers, as: :json

    assert_response :no_content
    assert_equal 6000, users(:alex).reload.weekly_goal
    assert_equal "Cohesion", users(:alex).focus_title
  end
end
