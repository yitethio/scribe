require "test_helper"

class Draft::CoachableTest < ActiveSupport::TestCase
  setup do
    @draft = drafts(:deliberate_practice)
    @draft.update!(body: "Technology has a big influence to the way people communicate. Due to the fact that we " \
      "rely on instant messaging, our capacity for argument has diminished.")
  end

  test "replaces the open issues with what Claude finds and keeps the resolved ones" do
    answer WritingCoach, with: { issues: [ issue(phrase: "influence to", category: "Word choice") ] }

    @draft.coach

    assert_equal [ "Due to the fact that", "influence to" ], @draft.coach_issues.order(:id).pluck(:phrase)
    assert coach_issues(:due_to).reload.resolved?
    assert_equal "#D97706", @draft.coach_issues.find_by(phrase: "influence to").category_color
  end

  test "drops issues that don't quote the draft or were already resolved" do
    answer WritingCoach, with: { issues: [ issue(phrase: "not in the draft"), issue(phrase: "Due to the fact that") ] }

    @draft.coach

    assert_equal [ "Due to the fact that" ], @draft.coach_issues.pluck(:phrase)
  end

  test "drops any field that rewrites the learner's sentence" do
    answer WritingCoach, with: { issues: [ issue(phrase: "influence to",
      sample_fix: "Technology has a big influence on the way people communicate.",
      hint: "Which preposition follows influence? Think of 'a lasting influence on her career'.") ] }

    @draft.coach

    coach_issue = @draft.coach_issues.find_by(phrase: "influence to")
    assert_nil coach_issue.sample_fix
    assert_match "Which preposition", coach_issue.hint
  end

  test "an empty draft can't be coached" do
    @draft.update!(body: "")

    assert_raises(ActiveRecord::RecordInvalid) { @draft.coach }
  end

  private
    def issue(**fields)
      { phrase: "influence to", category: "Word choice", badge: "Collocation", summary: "Check the preposition.",
        question: "Which preposition goes with influence?", hint: "It's a short word.",
        explanation: "Influence takes on.", sample_fix: "Her mentor had a lasting influence on her career." }.merge(fields)
    end
end
