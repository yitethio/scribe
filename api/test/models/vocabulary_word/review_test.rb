require "test_helper"

class VocabularyWord::ReviewTest < ActiveSupport::TestCase
  setup { @word = vocabulary_words(:undermine) }

  test "Claude judges a usage sentence" do
    answer UsageGrader, with: { correct: false, feedback: "'Undermine' takes an object: what is being weakened?" }
    review = @word.reviews.new(kind: "usage", sentence: "The rumours undermined.")

    review.grade
    review.save!

    assert_not review.correct?
    assert_match "takes an object", review.feedback
    assert_equal 1, @word.reload.correct_uses_count
  end

  test "without Claude a usage sentence needs the word" do
    review = @word.reviews.new(kind: "usage", sentence: "Rumours undermine trust.")

    review.grade
    review.save!

    assert review.correct?
    assert_nil review.feedback
  end

  test "other kinds keep the client's grade" do
    review = @word.reviews.new(kind: "selection", correct: false)

    review.grade
    review.save!

    assert_not review.correct?
  end
end
