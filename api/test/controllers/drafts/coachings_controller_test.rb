require "test_helper"

class Drafts::CoachingsControllerTest < ActionDispatch::IntegrationTest
  test "create coaches the draft and returns its issues" do
    answer WritingCoach, with: { issues: [ { phrase: "across digital spaces", category: "Style", badge: "Vague",
      summary: "This phrase is vague.", question: "Which spaces do you mean?", hint: "Name one.",
      explanation: "Concrete nouns land harder.", sample_fix: "Teenagers trade jokes in group chats." } ] }

    post draft_coaching_path(drafts(:deliberate_practice)), headers: auth_headers

    assert_response :created
    assert_equal draft_coach_issues_url(drafts(:deliberate_practice)), response.location
    assert_equal [ "Due to the fact that", "across digital spaces" ], json.pluck("phrase")
  end

  test "create when Claude is unavailable leaves the issues alone" do
    assert_no_difference -> { CoachIssue.count } do
      post draft_coaching_path(drafts(:deliberate_practice)), headers: auth_headers
    end

    assert_response :service_unavailable
  end

  test "create for an empty draft" do
    post draft_coaching_path(drafts(:sam_draft)), headers: auth_headers(users(:sam))

    assert_response :unprocessable_content
  end

  test "create for another user's draft" do
    post draft_coaching_path(drafts(:sam_draft)), headers: auth_headers

    assert_response :not_found
  end
end
