class Skill < ApplicationRecord
  belongs_to :user

  validates :key, :name, presence: true
  validates :score, numericality: { in: 0..100 }

  before_update :remember_previous_score, if: :score_changed?

  def change
    score - previous_score
  end

  def focused?
    user.focused_skill_id == id
  end

  def focus
    user.update!(focused_skill: self)
  end

  private
    def remember_previous_score
      self.previous_score = score_was
    end
end
