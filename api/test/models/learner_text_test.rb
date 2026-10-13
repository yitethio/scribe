require "test_helper"

class LearnerTextTest < ActiveSupport::TestCase
  setup do
    @text = LearnerText.new("Technology has a big influence to the way people communicate. I like it.")
  end

  test "a corrected version of the learner's sentence is a rewrite" do
    assert @text.rewritten_in?("Try this: Technology has a big influence on the way people communicate.")
  end

  test "a partial rewrite is still a rewrite" do
    assert @text.rewritten_in?("Technology has an influence on how people communicate.")
  end

  test "quoting the learner's exact words is not a rewrite" do
    assert_not @text.rewritten_in?(%(You wrote "Technology has a big influence to the way people communicate." Which preposition follows "influence"?))
  end

  test "an example on another subject is not a rewrite" do
    assert_not @text.rewritten_in?("Her teacher had a lasting influence on her career.")
  end

  test "short sentences are ignored" do
    assert_not @text.rewritten_in?("I like it a lot.")
  end
end
