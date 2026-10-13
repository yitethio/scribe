require "test_helper"

class Challenge::SubmissionTest < ActiveSupport::TestCase
  setup { @challenge = challenges(:week_42) }

  test "scores the passage against the challenge words" do
    submission = @challenge.submissions.create!(user: users(:alex),
      passage: "Tutors facilitate pacing, yet speed may undermine reading. Educators can mitigate this.")

    assert_equal 12, submission.word_count
    assert_equal %w[ facilitate undermine mitigate ], submission.used_words
    assert submission.passed?
  end

  test "matches inflected forms" do
    submission = @challenge.submissions.create!(user: users(:alex), passage: "Algorithms influenced and undermined us.")

    assert_equal %w[ influence undermine ], submission.used_words
    assert_not submission.passed?
  end

  test "records one activity and refreshes it on resubmission" do
    submission = @challenge.submissions.create!(user: users(:alex), passage: "One influence.")

    assert_no_difference -> { Activity.count } do
      submission.update!(passage: "An influence that can facilitate and undermine.")
    end

    assert_equal "Passed 3/3", submission.activity.status
    assert_equal 7, submission.activity.word_count
  end
end
