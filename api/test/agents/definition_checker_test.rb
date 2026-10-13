require "test_helper"

class DefinitionCheckerTest < ActiveSupport::TestCase
  test "instructions carry the ground rules and the request carries the learner's definition" do
    agent = DefinitionChecker.new(word: vocabulary_words(:mitigate))

    assert_match "the learner writes every sentence", agent.messages.first.content
    assert_match "The learner's definition: To make something less bad or less severe.", agent.request
  end

  test "answers with a dictionary entry and a verdict" do
    schema = DefinitionChecker.new(word: vocabulary_words(:mitigate)).schema[:schema]

    assert_equal %w[ part_of_speech definition example collocations synonyms verdict feedback ], schema[:required]
    assert_equal VocabularyWord::DEFINITION_VERDICTS, schema.dig(:properties, :verdict, :enum)
  end
end
