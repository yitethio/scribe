require "test_helper"

class DraftsControllerTest < ActionDispatch::IntegrationTest
  test "index" do
    get drafts_path, headers: auth_headers

    assert_response :success
    assert_equal [ "On Deliberate Practice & Prose Architecture" ], json.pluck("title")
    assert_equal 1, json.first["unresolved_issues_count"]
    assert_equal 13, json.first["word_count"]
  end

  test "create" do
    post drafts_path, params: { title: "Notes on rhythm", coach_level: "teacher" }, headers: auth_headers, as: :json

    assert_response :created
    assert_equal "teacher", json["coach_level"]
    assert json["coach_enabled"]
  end

  test "update" do
    patch draft_path(drafts(:deliberate_practice)), params: { body: "Shorter now.", coach_enabled: false }, headers: auth_headers, as: :json

    assert_response :no_content
    assert_not drafts(:deliberate_practice).reload.coach_enabled
  end

  test "update rejects an unknown coach level" do
    patch draft_path(drafts(:deliberate_practice)), params: { coach_level: "strict" }, headers: auth_headers, as: :json

    assert_response :unprocessable_content
  end

  test "destroy removes the draft and its issues" do
    assert_difference -> { CoachIssue.count }, -2 do
      delete draft_path(drafts(:deliberate_practice)), headers: auth_headers
    end

    assert_response :no_content
  end

  test "another user's draft is not found" do
    get draft_path(drafts(:sam_draft)), headers: auth_headers

    assert_response :not_found
  end
end
