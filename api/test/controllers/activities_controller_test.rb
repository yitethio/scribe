require "test_helper"

class ActivitiesControllerTest < ActionDispatch::IntegrationTest
  test "index lists the newest first" do
    get activities_path, headers: auth_headers

    assert_response :success
    assert_equal %w[ writing challenge revision ], json.pluck("kind")
  end

  test "index filters by kind" do
    get activities_path(kind: "revision"), headers: auth_headers

    assert_equal %w[ revision ], json.pluck("kind")
  end

  test "create" do
    post activities_path, params: { kind: "book_session", title: "The Craft of Prose — Page 24", word_count: 1284, duration_minutes: 42 },
      headers: auth_headers, as: :json

    assert_response :created
    assert_equal "book_session", json["kind"]
    assert json["occurred_at"].present?
  end
end
