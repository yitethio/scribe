class Draft < ApplicationRecord
  COACH_CATEGORY_COLORS = { "Grammar" => "#DC2626", "Word choice" => "#D97706", "Clarity" => "#7C3AED",
    "Cohesion" => "#2563EB", "Style" => "#059669" }
  COACH_CATEGORIES = COACH_CATEGORY_COLORS.keys

  include Coachable

  belongs_to :user
  has_many :coach_issues, dependent: :destroy

  enum :coach_level, %w[ minimal guided teacher review ].index_by(&:itself), validate: true

  validates :title, presence: true

  scope :latest, -> { order(updated_at: :desc, id: :desc) }

  def word_count
    body.to_s.split.size
  end
end
