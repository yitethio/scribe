require "test_helper"

class VocabularyWord::DefinitionCheckTest < ActiveSupport::TestCase
  setup do
    @word = vocabulary_words(:undermine)
    @word.update!(personal_definition: "To make something weaker.")
  end

  test "the first check fills in the dictionary entry" do
    answer DefinitionChecker, with: dictionary_entry.merge(verdict: "accurate", feedback: "You caught the core idea.")

    @word.check_definition

    assert @word.definition_accurate?
    assert_equal "You caught the core idea.", @word.definition_feedback
    assert_equal "To weaken gradually, especially from below.", @word.definition
    assert_equal [ "undermine confidence", "undermine efforts" ], @word.collocations
    assert @word.definition_checked_at
  end

  test "later checks keep the learner's edits to the dictionary entry" do
    @word.update!(definition: "My edited definition.")
    answer DefinitionChecker, with: dictionary_entry.merge(verdict: "partial", feedback: "Close.")

    @word.check_definition

    assert_equal "My edited definition.", @word.definition
    assert @word.definition_partial?
  end

  test "feedback that rewrites the learner's definition is dropped" do
    answer DefinitionChecker, with: dictionary_entry.merge(verdict: "partial",
      feedback: "Better: to make something gradually weaker from below.")

    @word.check_definition

    assert_nil @word.definition_feedback
  end

  test "needs the learner's own definition first" do
    @word.update!(personal_definition: nil)

    assert_raises(ActiveRecord::RecordInvalid) { @word.check_definition }
  end

  private
    def dictionary_entry
      { part_of_speech: "verb", definition: "To weaken gradually, especially from below.",
        example: "Rumors can undermine trust in a team.", collocations: [ "undermine confidence", "undermine efforts" ],
        synonyms: %w[ weaken erode ] }
    end
end
