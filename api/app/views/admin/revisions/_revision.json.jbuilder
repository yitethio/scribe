json.extract! revision, :id, :original, :focus_segment, :category, :prompt, :expected_keyword, :hint, :explanation,
  :created_at, :updated_at
json.attempts_count revision.attempts.size
