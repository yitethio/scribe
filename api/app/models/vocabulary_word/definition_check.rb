module VocabularyWord::DefinitionCheck
  extend ActiveSupport::Concern

  included do
    enum :definition_verdict, VocabularyWord::DEFINITION_VERDICTS.index_by(&:itself), prefix: :definition,
      validate: { allow_nil: true }
  end

  # Asks Claude how close the learner's own definition came. The first check also fills in the dictionary
  # fields; later checks leave whatever the learner has since edited.
  def check_definition
    if personal_definition.blank?
      errors.add :personal_definition, :blank
      raise ActiveRecord::RecordInvalid, self
    end

    check = DefinitionChecker.answer(word: self)
    update! dictionary_entry_from(check).merge(definition_verdict: check["verdict"],
      definition_feedback: feedback_from(check), definition_checked_at: Time.current)
  end

  private
    def dictionary_entry_from(check)
      definition.blank? ? check.slice("part_of_speech", "definition", "example", "collocations", "synonyms") : {}
    end

    def feedback_from(check)
      check["feedback"] unless LearnerText.new(personal_definition).rewritten_in?(check["feedback"])
    end
end
