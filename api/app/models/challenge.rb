class Challenge < ApplicationRecord
  has_many :submissions, dependent: :destroy

  validates :title, :theme, :starts_at, :due_at, presence: true
  validates :target_count, numericality: { greater_than: 0 }

  scope :reverse_chronologically, -> { order(starts_at: :desc, id: :desc) }
  scope :current, -> { where(starts_at: ..Time.current, due_at: Time.current..) }

  def open?
    Time.current.between?(starts_at, due_at)
  end

  def submission_for(user)
    submissions.find_by(user: user)
  end
end
