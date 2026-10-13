module Challenge::Submission::Gradable
  extend ActiveSupport::Concern

  included do
    before_save :match_words, if: -> { passage_changed? && !graded_passage? }
  end

  # Claude grades how the passage uses each challenge word. The call happens before the save so no
  # transaction waits on it. Without Claude, the rubric falls back to matching words.
  def submit(passage)
    self.passage = passage
    grade
    save!
  end

  def graded?
    rubric.any? { |entry| entry.key?("note") }
  end

  private
    def grade
      grades = ChallengeGrader.answer(submission: self).fetch("words").index_by { |entry| entry["word"].to_s.downcase }
      learner_text = LearnerText.new(passage)

      self.rubric = challenge.words.map do |word|
        if graded = grades[word.downcase]
          graded.slice("used", "correct", "natural").merge("word" => word,
            "note" => (graded["note"] unless learner_text.rewritten_in?(graded["note"])))
        else
          matched_entry_for(word)
        end
      end
      @graded_passage = passage
    rescue ApplicationAgent::Unavailable
      @graded_passage = nil
    end

    def graded_passage?
      @graded_passage.present? && @graded_passage == passage
    end

    def match_words
      self.rubric = challenge.words.map { |word| matched_entry_for(word) }
    end

    def matched_entry_for(word)
      { "word" => word, "used" => passage.match?(/\b#{Regexp.escape(word)}/i) }
    end
end
