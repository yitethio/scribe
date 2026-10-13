class Draft < ApplicationRecord
  belongs_to :user
  has_many :coach_issues, dependent: :destroy

  enum :coach_level, %w[ minimal guided teacher review ].index_by(&:itself), validate: true

  validates :title, presence: true

  scope :latest, -> { order(updated_at: :desc, id: :desc) }

  def word_count
    body.to_s.split.size
  end
end
