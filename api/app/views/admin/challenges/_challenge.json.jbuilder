json.extract! challenge, :id, :title, :theme, :words, :target_count, :starts_at, :due_at, :created_at, :updated_at
json.open challenge.open?
json.submissions_count challenge.submissions.size
