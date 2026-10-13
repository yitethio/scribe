json.extract! challenge, :id, :title, :theme, :words, :target_count, :starts_at, :due_at
json.open challenge.open?
submission = challenge.submission_for(Current.user)
json.submission do
  submission ? json.partial!("challenges/submissions/submission", submission: submission) : json.nil!
end
