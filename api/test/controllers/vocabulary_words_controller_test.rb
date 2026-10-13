require "test_helper"

class VocabularyWordsControllerTest < ActionDispatch::IntegrationTest
  test "index lists the current user's words" do
    get vocabulary_words_path, headers: auth_headers

    assert_response :success
    assert_equal %w[ mitigate undermine ], json.pluck("word").sort
  end

  test "index filters by status and search" do
    get vocabulary_words_path(status: "practicing"), headers: auth_headers
    assert_equal %w[ undermine ], json.pluck("word")

    get vocabulary_words_path(q: "MIT"), headers: auth_headers
    assert_equal %w[ mitigate ], json.pluck("word")
  end

  test "create" do
    post vocabulary_words_path, params: { word: "Precipice", part_of_speech: "Noun", synonyms: %w[ cliff brink ] },
      headers: auth_headers, as: :json

    assert_response :created
    assert_equal "precipice", json["word"]
    assert_equal %w[ cliff brink ], json["synonyms"]
    assert_equal vocabulary_word_url(json["id"]), response.location
  end

  test "create rejects a duplicate word" do
    post vocabulary_words_path, params: { word: "mitigate" }, headers: auth_headers, as: :json

    assert_response :unprocessable_content
  end

  test "update" do
    patch vocabulary_word_path(vocabulary_words(:undermine)), params: { status: "mastered" }, headers: auth_headers, as: :json

    assert_response :no_content
    assert vocabulary_words(:undermine).reload.mastered?
  end

  test "update rejects an unknown status" do
    patch vocabulary_word_path(vocabulary_words(:undermine)), params: { status: "forgotten" }, headers: auth_headers, as: :json

    assert_response :unprocessable_content
  end

  test "destroy" do
    delete vocabulary_word_path(vocabulary_words(:undermine)), headers: auth_headers

    assert_response :no_content
    assert_not VocabularyWord.exists?(vocabulary_words(:undermine).id)
  end

  test "another user's word is not found" do
    get vocabulary_word_path(vocabulary_words(:sam_lucid)), headers: auth_headers

    assert_response :not_found
  end
end
