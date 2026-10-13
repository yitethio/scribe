require "test_helper"

class Revisions::AttemptsControllerTest < ActionDispatch::IntegrationTest
  test "create with a correct revision" do
    assert_difference -> { users(:alex).activities.revision.count } do
      post revision_attempts_path(revisions(:influence_to)), params: { text: "Technology has a big Influence on us." },
        headers: auth_headers, as: :json
    end

    assert_response :created
    assert json["correct"]
    assert_equal "You fixed the preposition!", json["feedback"]
  end

  test "create with an incorrect revision returns the hint" do
    post revision_attempts_path(revisions(:influence_to)), params: { text: "Technology influences us." },
      headers: auth_headers, as: :json

    assert_response :created
    assert_not json["correct"]
    assert_match "Remember: 'influence' naturally takes 'on'.", json["feedback"]
  end

  test "index lists only the current user's attempts" do
    get revision_attempts_path(revisions(:due_to)), headers: auth_headers(users(:sam))

    assert_empty json
  end
end
