json.extract! submission, :id, :challenge_id, :passage, :word_count, :rubric, :used_words, :scored_words, :created_at,
  :updated_at
json.passed submission.passed?
json.graded submission.graded?
