class Revision < ApplicationRecord
  has_many :attempts, dependent: :destroy

  validates :original, :focus_segment, :category, :prompt, :expected_keyword, presence: true

  scope :mastered_by, ->(user) { where(id: Revision::Attempt.correct.where(user: user).select(:revision_id)) }

  def satisfied_by?(text)
    text.to_s.downcase.include?(expected_keyword.downcase)
  end

  def mastered_by?(user)
    attempts.correct.exists?(user: user)
  end
end
