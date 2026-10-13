require "test_helper"

class SkillsControllerTest < ActionDispatch::IntegrationTest
  test "index lists only the current user's skills" do
    get skills_path, headers: auth_headers

    assert_response :success
    assert_equal %w[ vocab cohesion ], json.pluck("key")
    assert_equal 8, json.first["change"]
  end

  test "update" do
    patch skill_path(skills(:alex_vocab)), params: { score: 90 }, headers: auth_headers, as: :json

    assert_response :no_content
    assert_equal 90, skills(:alex_vocab).reload.score
  end

  test "another user's skill is not found" do
    get skill_path(skills(:sam_vocab)), headers: auth_headers

    assert_response :not_found
  end

  test "focus" do
    post skill_focus_path(skills(:alex_cohesion)), headers: auth_headers

    assert_response :no_content
    assert_equal skills(:alex_cohesion), users(:alex).reload.focused_skill
  end
end
