require "test_helper"

class ChallengesControllerTest < ActionDispatch::IntegrationTest
  test "index lists the newest first" do
    get challenges_path, headers: auth_headers

    assert_response :success
    assert_equal [ "Weekly Writing Challenge", "Last Week's Challenge" ], json.pluck("title")
    assert_equal [ true, false ], json.pluck("open")
  end

  test "index filtered to the current challenge" do
    get challenges_path(current: true), headers: auth_headers

    assert_equal [ "Weekly Writing Challenge" ], json.pluck("title")
  end

  test "show includes only the current user's submission" do
    get challenge_path(challenges(:week_42)), headers: auth_headers(users(:sam))
    assert_equal [ "influence" ], json.dig("submission", "used_words")

    get challenge_path(challenges(:week_42)), headers: auth_headers
    assert_nil json["submission"]
  end
end
