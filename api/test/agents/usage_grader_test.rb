require "test_helper"

class UsageGraderTest < ActiveSupport::TestCase
  test "the request carries the word, its meaning and the learner's sentence" do
    review = vocabulary_words(:mitigate).reviews.new(kind: "usage", sentence: "Dams mitigate floods.")
    agent = UsageGrader.new(review: review)

    assert_match "You judge the usage", agent.messages.first.content
    assert_match "Word: mitigate (verb)\nMeaning: To reduce the severity", agent.request
    assert_match "Dams mitigate floods.", agent.request
  end
end
