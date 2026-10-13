json.extract! coach_issue, :id, :draft_id, :phrase, :category, :category_color, :badge, :summary, :question,
  :hint, :explanation, :sample_fix
json.resolved coach_issue.resolved?
json.resolution coach_issue.resolution&.slice(:revision, :created_at)
