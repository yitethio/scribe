require "test_helper"

class ChallengeGraderTest < ActiveSupport::TestCase
  test "the request carries the theme, the words and the passage" do
    agent = ChallengeGrader.new(submission: challenge_submissions(:sam_week_42))

    assert_match "Grade how they used each target word", agent.messages.first.content
    assert_match "Target words: influence, facilitate, undermine, mitigate", agent.request
    assert_match "Screens influence how we read.", agent.request
  end
end
