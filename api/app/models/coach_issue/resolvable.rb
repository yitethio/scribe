module CoachIssue::Resolvable
  extend ActiveSupport::Concern

  included do
    has_one :resolution, dependent: :destroy

    scope :resolved, -> { joins(:resolution) }
    scope :unresolved, -> { where.missing(:resolution) }
  end

  def resolved?
    resolution.present?
  end

  def resolve(revision: nil)
    resolution || create_resolution!(revision: revision)
  end

  def unresolve
    resolution&.destroy
    reload_resolution
  end
end
