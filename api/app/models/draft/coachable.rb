module Draft::Coachable
  extend ActiveSupport::Concern

  COACH_FIELDS = %w[ badge summary question hint explanation sample_fix ]

  # Asks Claude to read the draft and replaces the open coach issues with what it finds. Resolved issues stay.
  # Issues that don't quote the draft are dropped, and so is any field that rewrites the learner's sentences.
  def coach
    if body.blank?
      errors.add :body, :blank
      raise ActiveRecord::RecordInvalid, self
    end

    issues = WritingCoach.answer(draft: self).fetch("issues").select { |issue| coachable?(issue) }

    transaction do
      coach_issues.unresolved.destroy_all
      issues.each { |issue| coach_issues.create!(coach_issue_attributes_from(issue)) }
    end
  end

  private
    def coachable?(issue)
      issue["phrase"].present? && body.downcase.include?(issue["phrase"].downcase) &&
        coach_issues.resolved.where(phrase: issue["phrase"]).none?
    end

    def coach_issue_attributes_from(issue)
      learner_text = LearnerText.new(body)
      fields = issue.slice(*COACH_FIELDS).transform_values { |value| value.presence unless learner_text.rewritten_in?(value) }
      fields.merge(phrase: issue["phrase"], category: issue["category"], category_color: Draft::COACH_CATEGORY_COLORS[issue["category"]])
    end
end
