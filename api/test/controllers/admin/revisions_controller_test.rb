require "test_helper"

class Admin::RevisionsControllerTest < ActionDispatch::IntegrationTest
  test "only admins get in" do
    post admin_revisions_path, headers: auth_headers, params: { original: "Hi." }, as: :json

    assert_response :forbidden
  end

  test "index shows the answers learners don't see" do
    get admin_revisions_path, headers: auth_headers(users(:kim))

    assert_response :success
    assert_equal [ "influence on", "because" ], json.pluck("expected_keyword")
    assert_equal [ 0, 1 ], json.pluck("attempts_count")
  end

  test "show" do
    get admin_revision_path(revisions(:due_to)), headers: auth_headers(users(:kim))

    assert_response :success
    assert_equal "Excellent revision!", json["explanation"]
  end

  test "create" do
    assert_difference -> { Revision.count } do
      post admin_revisions_path, headers: auth_headers(users(:kim)), as: :json, params: {
        original: "She is more taller than her brother.", focus_segment: "more taller", category: "Grammar",
        prompt: "Can you fix the comparative?", expected_keyword: "taller than", hint: "One comparative is enough."
      }
    end

    assert_response :created
    assert_equal admin_revision_url(Revision.last), response.location
  end

  test "create with missing fields" do
    post admin_revisions_path, headers: auth_headers(users(:kim)), params: { original: "Hi." }, as: :json

    assert_response :unprocessable_content
    assert json.dig("errors", "expected_keyword").any?
  end

  test "update" do
    patch admin_revision_path(revisions(:due_to)), headers: auth_headers(users(:kim)),
      params: { hint: "Start with 'Because'." }, as: :json

    assert_response :no_content
    assert_equal "Start with 'Because'.", revisions(:due_to).reload.hint
  end

  test "destroy removes its attempts" do
    assert_difference -> { Revision::Attempt.count }, -1 do
      delete admin_revision_path(revisions(:due_to)), headers: auth_headers(users(:kim))
    end

    assert_response :no_content
  end
end
