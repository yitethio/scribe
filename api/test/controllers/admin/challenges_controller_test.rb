require "test_helper"

class Admin::ChallengesControllerTest < ActionDispatch::IntegrationTest
  test "only admins get in" do
    get admin_challenges_path, headers: auth_headers

    assert_response :forbidden
  end

  test "index lists every challenge with its submission count" do
    get admin_challenges_path, headers: auth_headers(users(:kim))

    assert_response :success
    assert_equal [ "Weekly Writing Challenge", "Last Week's Challenge" ], json.pluck("title")
    assert_equal [ 1, 0 ], json.pluck("submissions_count")
  end

  test "show" do
    get admin_challenge_path(challenges(:week_42)), headers: auth_headers(users(:kim))

    assert_response :success
    assert_equal %w[ influence facilitate undermine mitigate ], json["words"]
  end

  test "create" do
    assert_difference -> { Challenge.count } do
      post admin_challenges_path, headers: auth_headers(users(:kim)), as: :json, params: {
        title: "Week 43", theme: "Rivers.", words: %w[ meander estuary ], target_count: 2,
        starts_at: 5.days.from_now, due_at: 12.days.from_now
      }
    end

    assert_response :created
    assert_equal admin_challenge_url(Challenge.last), response.location
    assert_equal %w[ meander estuary ], json["words"]
    assert_not json["open"]
  end

  test "create with missing fields" do
    post admin_challenges_path, headers: auth_headers(users(:kim)), params: { title: "Week 43" }, as: :json

    assert_response :unprocessable_content
    assert json.dig("errors", "theme").any?
  end

  test "update" do
    patch admin_challenge_path(challenges(:week_42)), headers: auth_headers(users(:kim)),
      params: { words: %w[ influence mitigate ], target_count: 2 }, as: :json

    assert_response :no_content
    assert_equal %w[ influence mitigate ], challenges(:week_42).reload.words
  end

  test "destroy removes its submissions" do
    assert_difference -> { Challenge::Submission.count }, -1 do
      delete admin_challenge_path(challenges(:week_42)), headers: auth_headers(users(:kim))
    end

    assert_response :no_content
  end
end
