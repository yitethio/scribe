require "test_helper"

class CoachIssueTest < ActiveSupport::TestCase
  test "resolved and unresolved scopes" do
    assert_equal [ coach_issues(:due_to) ], drafts(:deliberate_practice).coach_issues.resolved
    assert_equal [ coach_issues(:influence_to) ], drafts(:deliberate_practice).coach_issues.unresolved
  end

  test "resolve is idempotent and unresolve removes the record" do
    issue = coach_issues(:influence_to)

    assert_difference -> { CoachIssue::Resolution.count } do
      2.times { issue.resolve(revision: "an influence on") }
    end
    assert issue.resolved?

    issue.unresolve
    assert_not issue.resolved?
  end
end
