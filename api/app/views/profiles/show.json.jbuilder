json.partial! "users/user", user: @user
json.extract! @user, :role_title, :level, :weekly_goal, :focused_skill_id
json.focus do
  json.title @user.focus_title
  json.description @user.focus_description
  json.recommendation @user.focus_recommendation
end
json.stats do
  json.words_today @user.words_written_since(Time.current.beginning_of_day)
  json.words_this_week @user.words_written_since(Time.current.beginning_of_week)
  json.words_this_month @user.words_written_since(Time.current.beginning_of_month)
  json.streak_days @user.streak_days
  json.streak_history @user.streak_history
  json.sessions_completed_count @user.sessions_completed_count
  json.vocabulary_learned_count @user.vocabulary_words.count
  json.vocabulary_retention_rate @user.vocabulary_retention_rate
end
