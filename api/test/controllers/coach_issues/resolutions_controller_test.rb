require "test_helper"

class CoachIssues::ResolutionsControllerTest < ActionDispatch::IntegrationTest
  test "create resolves the issue" do
    post coach_issue_resolution_path(coach_issues(:influence_to)), params: { revision: "a big influence on" },
      headers: auth_headers, as: :json

    assert_response :created
    assert json["resolved"]
    assert_equal "a big influence on", json.dig("resolution", "revision")
  end

  test "destroy reopens the issue" do
    delete coach_issue_resolution_path(coach_issues(:due_to)), headers: auth_headers

    assert_response :no_content
    assert_not coach_issues(:due_to).reload.resolved?
  end
end
