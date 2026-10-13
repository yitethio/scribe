require "test_helper"

class BookSessionsControllerTest < ActionDispatch::IntegrationTest
  test "index" do
    get book_sessions_path, headers: auth_headers

    assert_response :success
    assert_equal [ "The Craft of Prose: Guide to Elegant Writing" ], json.pluck("book_title")
    assert_equal %w[ undermine ], json.first["words"]
  end

  test "create" do
    post book_sessions_path, params: { book_title: "Bird by Bird", total_pages: 240 }, headers: auth_headers, as: :json

    assert_response :created
    assert_equal 1, json["current_page"]
    assert_equal book_session_url(json["id"]), response.location
  end

  test "update" do
    patch book_session_path(book_sessions(:craft_of_prose)), params: { current_page: 25, draft_text: "Rewritten." },
      headers: auth_headers, as: :json

    assert_response :no_content
    assert_equal 25, book_sessions(:craft_of_prose).reload.current_page
  end

  test "destroy" do
    delete book_session_path(book_sessions(:craft_of_prose)), headers: auth_headers

    assert_response :no_content
    assert_not BookSession.exists?(book_sessions(:craft_of_prose).id)
  end

  test "another user's session is not found" do
    get book_session_path(book_sessions(:sam_reading)), headers: auth_headers

    assert_response :not_found
  end
end
