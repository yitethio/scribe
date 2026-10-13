require "test_helper"

class Challenge::Submission::GradableTest < ActiveSupport::TestCase
  setup do
    @submission = challenges(:week_42).submissions.new(user: users(:alex))
  end

  test "Claude grades each challenge word" do
    answer ChallengeGrader, with: { words: [
      grade("influence", used: true, correct: true, natural: "natural", note: "Nicely paired with 'on'."),
      grade("facilitate", used: true, correct: false, natural: "unnatural", note: "Check what 'facilitate' takes."),
      grade("undermine", used: true, correct: true, natural: "awkward", note: "Grammatical but stiff."),
      grade("mitigate", used: false, correct: false, natural: "unnatural", note: "Try it next time.") ] }

    @submission.submit "Screens have an influence on us. They facilitate to skim and undermine deep reading."

    assert @submission.graded?
    assert_equal %w[ influence facilitate undermine ], @submission.used_words
    assert_equal %w[ influence undermine ], @submission.scored_words
    assert_not @submission.passed?
    assert_equal "awkward", @submission.rubric.third["natural"]
    assert_equal "Used 2/3", @submission.activity.status
  end

  test "words Claude skipped fall back to word matching" do
    answer ChallengeGrader, with: { words: [ grade("influence", used: true, correct: true, natural: "natural", note: "Good.") ] }

    @submission.submit "We influence and mitigate."

    assert_equal %w[ influence mitigate ], @submission.used_words
    assert_equal({ "word" => "mitigate", "used" => true }, @submission.rubric.last)
  end

  test "notes that rewrite the passage are dropped" do
    answer ChallengeGrader, with: { words: [ grade("influence", used: true, correct: false, natural: "unnatural",
      note: "Write it as: screens have a big influence on the way we read.") ] }

    @submission.submit "Screens have a big influence to the way we read."

    assert_nil @submission.rubric.first["note"]
  end

  test "without Claude the rubric matches words" do
    @submission.submit "Algorithms influenced and undermined us."

    assert_not @submission.graded?
    assert_equal %w[ influence undermine ], @submission.used_words
  end

  private
    def grade(word, **fields)
      { word: word, **fields }
    end
end
