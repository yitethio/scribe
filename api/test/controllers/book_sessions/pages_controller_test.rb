require "test_helper"

class BookSessions::PagesControllerTest < ActionDispatch::IntegrationTest
  setup { @book_session = book_sessions(:craft_of_prose) }

  test "index" do
    get book_session_pages_path(@book_session), headers: auth_headers

    assert_response :success
    assert_equal [ 24 ], json.pluck("number")
  end

  test "show by page number" do
    get book_session_page_path(@book_session, 24), headers: auth_headers

    assert_response :success
    assert_equal "Section 3: Narrative Momentum and the Edge", json["subhead"]
  end

  test "update creates a missing page" do
    put book_session_page_path(@book_session, 25), params: { chapter: "Chapter IV", paragraphs: [ "Suspense is not manufactured." ] },
      headers: auth_headers, as: :json

    assert_response :no_content
    assert_equal [ "Suspense is not manufactured." ], @book_session.pages.find_by(number: 25).paragraphs
  end

  test "show a missing page" do
    get book_session_page_path(@book_session, 99), headers: auth_headers

    assert_response :not_found
  end
end
