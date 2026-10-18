require "test_helper"

class WritingCoachTest < ActiveSupport::TestCase
  test "instructions follow the draft's coaching level" do
    drafts(:deliberate_practice).coach_level = "teacher"
    agent = WritingCoach.new(draft: drafts(:deliberate_practice))

    assert_match "the learner writes every sentence", agent.messages.first.content
    assert_match "give a full explanation", agent.messages.first.content
    assert_match "Technology has a big influence to the way", agent.request
  end

  test "issues use the coach categories" do
    schema = WritingCoach.new(draft: drafts(:deliberate_practice)).schema[:schema]

    assert_equal Draft::COACH_CATEGORIES, schema.dig(:properties, :issues, :items, :properties, :category, :enum)
  end
end
