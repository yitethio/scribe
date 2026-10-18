class Activity < ApplicationRecord
  belongs_to :user
  belongs_to :subject, polymorphic: true, optional: true

  enum :kind, %w[ book_session challenge writing revision ].index_by(&:itself), validate: true

  validates :title, presence: true

  before_validation { self.occurred_at ||= Time.current }

  scope :reverse_chronologically, -> { order(occurred_at: :desc, id: :desc) }
  scope :since, ->(time) { where(occurred_at: time..) }
end
