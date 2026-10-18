require "test_helper"

class Revision::AttemptTest < ActiveSupport::TestCase
  setup do
    @attempt = revisions(:influence_to).attempts.new(user: users(:alex), text: "Technology strongly shapes how people communicate.")
  end

  test "Claude accepts any fix that works" do
    answer RevisionGrader, with: { correct: true, feedback: "Swapping in a verb sidesteps the preposition entirely." }

    @attempt.grade
    @attempt.save!

    assert @attempt.correct?
    assert_equal "Swapping in a verb sidesteps the preposition entirely.", @attempt.feedback
  end

  test "feedback that rewrites the revision falls back to the exercise's hint" do
    answer RevisionGrader, with: { correct: false, feedback: "Try: technology strongly influences how people communicate." }

    @attempt.grade
    @attempt.save!

    assert_not @attempt.correct?
    assert_match "Remember: 'influence' naturally takes 'on'.", @attempt.feedback
  end

  test "without Claude a revision needs the expected keyword" do
    @attempt.grade
    @attempt.save!

    assert_not @attempt.correct?
  end
end
