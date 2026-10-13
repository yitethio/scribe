class CoachIssue < ApplicationRecord
  include Resolvable

  belongs_to :draft, touch: true

  validates :phrase, :category, presence: true

  scope :chronologically, -> { order(:created_at, :id) }
end
