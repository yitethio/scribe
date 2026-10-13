class Revision::Attempt < ApplicationRecord
  belongs_to :revision
  belongs_to :user
  has_one :activity, as: :subject, dependent: :destroy

  validates :text, presence: true

  scope :correct, -> { where(correct: true) }

  before_validation { self.correct = revision.satisfied_by?(text) }
  after_create_commit :record_activity

  def feedback
    correct? ? revision.explanation : "Take another look at \"#{revision.focus_segment}\". Hint: #{revision.hint}"
  end

  private
    def record_activity
      create_activity!(user: user, kind: "revision", title: revision.category, word_count: text.split.size,
        status: correct? ? "Mastered" : "Needs refinement")
    end
end
