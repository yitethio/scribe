class Revision::Attempt < ApplicationRecord
  belongs_to :revision
  belongs_to :user
  has_one :activity, as: :subject, dependent: :destroy

  validates :text, presence: true

  scope :correct, -> { where(correct: true) }

  before_validation :match_keyword, if: -> { correct.nil? }
  after_create_commit :record_activity

  # Claude judges the revision before it's saved, so no transaction waits on it. Without Claude, a revision
  # is correct when it contains the exercise's expected keyword.
  def grade
    graded = RevisionGrader.answer(attempt: self)
    self.correct = graded["correct"]
    self.feedback = graded["feedback"] unless LearnerText.new(text).rewritten_in?(graded["feedback"])
  rescue ApplicationAgent::Unavailable
    self.correct = nil
  end

  def feedback
    super.presence || (correct? ? revision.explanation : "Take another look at \"#{revision.focus_segment}\". Hint: #{revision.hint}")
  end

  private
    def match_keyword
      self.correct = revision.satisfied_by?(text)
    end

    def record_activity
      create_activity!(user: user, kind: "revision", title: revision.category, word_count: text.split.size,
        status: correct? ? "Mastered" : "Needs refinement")
    end
end
