class CoachIssue::Resolution < ApplicationRecord
  belongs_to :coach_issue, touch: true
end
