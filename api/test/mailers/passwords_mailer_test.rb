require "test_helper"

class PasswordsMailerTest < ActionMailer::TestCase
  test "reset links to the frontend's reset page" do
    email = PasswordsMailer.reset(users(:alex))

    assert_equal [ "alex@example.com" ], email.to
    assert_match %r{http://localhost:5173/reset-password\?token=\S+}, email.body.to_s
  end
end
