require "test_helper"

class CoachIssuesControllerTest < ActionDispatch::IntegrationTest
  setup { @draft = drafts(:deliberate_practice) }

  test "index" do
    get draft_coach_issues_path(@draft), headers: auth_headers

    assert_response :success
    assert_equal [ "influence to", "Due to the fact that" ], json.pluck("phrase")
    assert_equal [ false, true ], json.pluck("resolved")
  end

  test "index filtered by resolved" do
    get draft_coach_issues_path(@draft, resolved: false), headers: auth_headers

    assert_equal [ "influence to" ], json.pluck("phrase")
  end

  test "create" do
    post draft_coach_issues_path(@draft), params: { phrase: "Furthermore", category: "Cohesion" }, headers: auth_headers, as: :json

    assert_response :created
    assert_equal coach_issue_url(json["id"]), response.location
  end

  test "update" do
    patch coach_issue_path(coach_issues(:influence_to)), params: { hint: "Think prepositions." }, headers: auth_headers, as: :json

    assert_response :no_content
    assert_equal "Think prepositions.", coach_issues(:influence_to).reload.hint
  end

  test "destroy" do
    delete coach_issue_path(coach_issues(:influence_to)), headers: auth_headers

    assert_response :no_content
  end

  test "another user's issue is not found" do
    get coach_issue_path(coach_issues(:sam_issue)), headers: auth_headers

    assert_response :not_found
  end
end
