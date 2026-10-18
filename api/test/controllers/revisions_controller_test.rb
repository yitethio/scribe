require "test_helper"

class RevisionsControllerTest < ActionDispatch::IntegrationTest
  test "index marks what the current user has mastered" do
    get revisions_path, headers: auth_headers

    assert_response :success
    assert_equal [ false, true ], json.pluck("mastered")
    assert_not json.first.key?("expected_keyword")
  end

  test "index filtered to what is left to practice" do
    get revisions_path(mastered: false), headers: auth_headers

    assert_equal [ "influence to" ], json.pluck("focus_segment")
  end

  test "show" do
    get revision_path(revisions(:influence_to)), headers: auth_headers

    assert_response :success
    assert_equal "Collocation / Preposition", json["category"]
  end
end
