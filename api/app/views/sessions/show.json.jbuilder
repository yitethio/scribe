json.token Current.session.token
json.user do
  json.partial! "users/user", user: Current.user
end
