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
end
