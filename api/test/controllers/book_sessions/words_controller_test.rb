require "test_helper"

class BookSessions::WordsControllerTest < ActionDispatch::IntegrationTest
  setup { @book_session = book_sessions(:craft_of_prose) }

  test "index" do
    get book_session_words_path(@book_session), headers: auth_headers

    assert_response :success
    assert_equal %w[ undermine ], json.pluck("word")
  end

  test "create captures a word" do
    post book_session_words_path(@book_session), params: { word: "formidable", context_sentence: "A formidable barrier." },
      headers: auth_headers, as: :json

    assert_response :created
    assert_equal "formidable", json["word"]
    assert_includes @book_session.vocabulary_words.pluck(:word), "formidable"
  end

  test "create without a word" do
    post book_session_words_path(@book_session), params: {}, headers: auth_headers, as: :json

    assert_response :bad_request
  end

  test "destroy removes the word from the session but keeps it in the vocabulary" do
    delete book_session_word_path(@book_session, vocabulary_words(:undermine)), headers: auth_headers

    assert_response :no_content
    assert_empty @book_session.vocabulary_words
    assert VocabularyWord.exists?(vocabulary_words(:undermine).id)
  end
end
