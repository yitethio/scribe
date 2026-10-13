require "test_helper"

class SeedsTest < ActiveSupport::TestCase
  test "sample data loads twice without duplicates" do
    assert_output(/Seeded/) { 2.times { Rails.application.load_seed } }

    user = User.find_by!(email_address: "demo@scribe.test")
    assert_equal 10, user.vocabulary_words.count
    assert_equal %w[ precipice formidable bewildered peculiar ], user.book_sessions.sole.vocabulary_words.pluck(:word)
    assert_equal 3, user.drafts.sole.coach_issues.count
    assert_equal "cohesion", user.focused_skill.key
  end
end
