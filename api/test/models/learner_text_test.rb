require "test_helper"

class LearnerTextTest < ActiveSupport::TestCase
  setup do
    @text = LearnerText.new("Technology has a big influence to the way people communicate. I like it.")
  end

  test "a corrected version of the learner's sentence is a rewrite" do
    assert @text.rewritten_in?("Try this: Technology has a big influence on the way people communicate.")
  end

  test "a partial rewrite is still a rewrite" do
    assert @text.rewritten_in?("Technology has a big influence on how people talk.")
  end

  test "quoting the learner's exact words is not a rewrite" do
    assert_not @text.rewritten_in?(%(You wrote "Technology has a big influence to the way people communicate." Which preposition follows "influence"?))
  end

  test "an example on another subject is not a rewrite" do
    assert_not @text.rewritten_in?("Her teacher had a lasting influence on her career.")
  end

  test "a paraphrase that reuses most of the learner's words is a rewrite" do
    assert LearnerText.new("To make something weaker.").rewritten_in?("Better: to make something gradually weaker.")
  end

  test "feedback that echoes a few of the learner's words is not a rewrite" do
    text = LearnerText.new("To make something less bad or less severe.")

    assert_not text.rewritten_in?("Spot on: you caught the idea of making something less severe.")
  end

  test "very short sentences are ignored" do
    assert_not @text.rewritten_in?("I like it a lot.")
  end
end
