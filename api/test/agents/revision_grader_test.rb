require "test_helper"

class RevisionGraderTest < ActiveSupport::TestCase
  test "the request carries the exercise and the learner's revision" do
    attempt = revisions(:influence_to).attempts.new(user: users(:alex), text: "Technology strongly shapes how we talk.")
    agent = RevisionGrader.new(attempt: attempt)

    assert_match "Any fix that works counts", agent.messages.first.content
    assert_match "Focus segment: influence to", agent.request
    assert_match "Technology strongly shapes how we talk.", agent.request
  end
end
