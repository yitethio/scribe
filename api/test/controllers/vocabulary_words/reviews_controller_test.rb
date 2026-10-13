require "test_helper"

class VocabularyWords::ReviewsControllerTest < ActionDispatch::IntegrationTest
  test "create grades a usage sentence" do
    post vocabulary_word_reviews_path(vocabulary_words(:undermine)),
      params: { kind: "usage", sentence: "Doubt can undermine a draft." }, headers: auth_headers, as: :json

    assert_response :created
    assert json["correct"]
    assert_equal 2, json.dig("vocabulary_word", "correct_uses_count")
  end

  test "create with Claude judging a usage sentence" do
    answer UsageGrader, with: { correct: true, feedback: "A natural fit: 'undermine' suits gradual, hidden damage." }

    post vocabulary_word_reviews_path(vocabulary_words(:undermine)),
      params: { kind: "usage", sentence: "Doubt can undermine a draft." }, headers: auth_headers, as: :json

    assert_response :created
    assert json["correct"]
    assert_match "A natural fit", json["feedback"]
  end

  test "create records a selection answer graded by the client" do
    post vocabulary_word_reviews_path(vocabulary_words(:undermine)),
      params: { kind: "selection", correct: false }, headers: auth_headers, as: :json

    assert_response :created
    assert_equal [ 4, 1 ], json["vocabulary_word"].values_at("uses_count", "correct_uses_count")
  end

  test "index" do
    vocabulary_words(:undermine).reviews.create!(kind: "recall", correct: true)

    get vocabulary_word_reviews_path(vocabulary_words(:undermine)), headers: auth_headers

    assert_response :success
    assert_equal %w[ recall ], json.pluck("kind")
  end
end
