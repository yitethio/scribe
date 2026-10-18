require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "downcases and strips email_address" do
    user = User.new(email_address: " DOWNCASED@EXAMPLE.COM ")
    assert_equal("downcased@example.com", user.email_address)
  end

  test "requires a password of at least 8 characters" do
    user = User.new(name: "Mira", email_address: "mira@example.com", password: "short")
    assert_not user.valid?
    assert user.errors[:password].any?
  end

  test "destroying a user removes everything they own" do
    users(:alex).update!(focused_skill: skills(:alex_cohesion))

    assert_difference -> { Skill.count }, -2 do
      users(:alex).destroy!
    end
  end

  test "resetting the password signs out every session" do
    user = users(:alex)
    user.reset_password_to "brand new password"

    assert user.authenticate("brand new password")
    assert_empty user.sessions
  end
end
