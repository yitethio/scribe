module SessionTestHelper
  def auth_headers(user = users(:alex))
    { "Authorization" => "Bearer #{user.sessions.first.token}" }
  end

  def json
    response.parsed_body
  end
end

ActiveSupport.on_load(:action_dispatch_integration_test) do
  include SessionTestHelper
end
