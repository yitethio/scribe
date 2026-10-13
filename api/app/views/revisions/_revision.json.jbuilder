json.extract! revision, :id, :original, :focus_segment, :category, :prompt, :hint
json.mastered revision.mastered_by?(Current.user)
