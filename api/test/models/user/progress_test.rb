require "test_helper"

class User::ProgressTest < ActiveSupport::TestCase
  setup { @user = users(:alex) }

  test "words written since a time" do
    assert_equal 400, @user.words_written_since(2.hours.ago)
    assert_equal 800, @user.words_written_since(1.week.ago)
  end

  test "streak counts consecutive days ending today" do
    assert_equal 2, @user.streak_days
  end

  test "streak still counts when today has no practice yet" do
    activities(:today).destroy

    assert_equal 1, @user.streak_days
  end

  test "streak history covers the last 14 days, oldest first" do
    history = @user.streak_history

    assert_equal 14, history.size
    assert_equal [ true, false, true, true ], history.last(4)
  end

  test "vocabulary retention rate across all words" do
    assert_equal 75, @user.vocabulary_retention_rate
    assert_nil users(:sam).vocabulary_retention_rate
  end
end
