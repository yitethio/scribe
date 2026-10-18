require "test_helper"

class Challenges::SubmissionsControllerTest < ActionDispatch::IntegrationTest
  test "create submits a passage" do
    post challenge_submission_path(challenges(:week_42)), params: { passage: "We influence, facilitate and mitigate." },
      headers: auth_headers, as: :json

    assert_response :created
    assert json["passed"]
    assert_not json["graded"]
    assert_equal %w[ influence facilitate mitigate ], json["used_words"]
  end

  test "create with Claude grading the passage" do
    answer ChallengeGrader, with: { words: %w[ influence facilitate undermine mitigate ].map { |word|
      { word: word, used: true, correct: true, natural: "natural", note: "Well used." } } }

    post challenge_submission_path(challenges(:week_42)), headers: auth_headers, as: :json,
      params: { passage: "Screens influence us, facilitate skimming, undermine focus, and mitigate boredom." }

    assert_response :created
    assert json["graded"]
    assert_equal [ "Well used." ] * 4, json["rubric"].pluck("note")
  end

  test "create again replaces the passage" do
    assert_no_difference -> { Challenge::Submission.count } do
      post challenge_submission_path(challenges(:week_42)), params: { passage: "No words here." },
        headers: auth_headers(users(:sam)), as: :json
    end

    assert_equal "No words here.", json["passage"]
  end

  test "create on a closed challenge" do
    post challenge_submission_path(challenges(:week_41)), params: { passage: "Lucid." }, headers: auth_headers, as: :json

    assert_response :unprocessable_content
  end

  test "show the current user's submission" do
    get challenge_submission_path(challenges(:week_42)), headers: auth_headers(users(:sam))

    assert_response :success
    assert_equal "Screens influence how we read.", json["passage"]
  end

  test "show when nothing is submitted yet" do
    get challenge_submission_path(challenges(:week_42)), headers: auth_headers

    assert_response :not_found
  end
end
