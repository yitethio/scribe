require "test_helper"

class VocabularyWordTest < ActiveSupport::TestCase
  test "words are unique per user, ignoring case" do
    word = users(:alex).vocabulary_words.new(word: " Mitigate ")

    assert_not word.valid?
    assert_equal "mitigate", word.word
  end

  test "a correct usage review counts the use and keeps the sentence" do
    word = vocabulary_words(:undermine)
    word.reviews.create!(kind: "usage", sentence: "Rumours undermine trust.")
    word.reload

    assert_equal [ 4, 2 ], [ word.uses_count, word.correct_uses_count ]
    assert_equal "Rumours undermine trust.", word.context_sentence
    assert word.last_reviewed_at.present?
  end

  test "a usage review without the word is incorrect" do
    review = vocabulary_words(:undermine).reviews.create!(kind: "usage", sentence: "Rumours weaken trust.")

    assert_not review.correct?
    assert_equal 1, vocabulary_words(:undermine).reload.correct_uses_count
  end

  test "retention rate" do
    assert_equal 33, vocabulary_words(:undermine).retention_rate
    assert_nil vocabulary_words(:sam_lucid).retention_rate
  end

  test "new is a status" do
    word = users(:alex).vocabulary_words.create!(word: "lucid", status: "new")

    assert word.new?
    assert_not word.new_record?
  end
end
