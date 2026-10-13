json.extract! draft, :id, :title, :body, :word_count, :coach_enabled, :coach_level, :created_at, :updated_at
json.unresolved_issues_count draft.coach_issues.unresolved.count
