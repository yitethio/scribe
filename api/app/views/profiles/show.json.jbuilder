json.partial! "users/user", user: @user
json.extract! @user, :role_title, :level, :weekly_goal, :focused_skill_id
json.focus do
  json.title @user.focus_title
  json.description @user.focus_description
  json.recommendation @user.focus_recommendation
end
