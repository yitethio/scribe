require "test_helper"

class SkillTest < ActiveSupport::TestCase
  test "updating the score keeps the old one for the change" do
    skill = skills(:alex_vocab)
    skill.update!(score: 80)

    assert_equal 72, skill.previous_score
    assert_equal 8, skill.change
  end

  test "focus makes it the user's only focused skill" do
    skills(:alex_cohesion).focus
    skills(:alex_vocab).focus

    assert skills(:alex_vocab).reload.focused?
    assert_not skills(:alex_cohesion).reload.focused?
  end
end
