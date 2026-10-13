require "test_helper"

class VocabularyWords::DefinitionChecksControllerTest < ActionDispatch::IntegrationTest
  test "create checks the learner's definition" do
    answer DefinitionChecker, with: { part_of_speech: "verb", definition: "To reduce the severity of something.",
      example: "Planting trees can mitigate flooding.", collocations: [ "mitigate risk" ], synonyms: [ "lessen" ],
      verdict: "accurate", feedback: "Spot on: you caught the idea of making something less severe." }

    post vocabulary_word_definition_check_path(vocabulary_words(:mitigate)), headers: auth_headers

    assert_response :created
    assert_equal "accurate", json["definition_verdict"]
    assert_match "Spot on", json["definition_feedback"]
  end

  test "create without a definition of the learner's own" do
    post vocabulary_word_definition_check_path(vocabulary_words(:undermine)), headers: auth_headers

    assert_response :unprocessable_content
    assert json.dig("errors", "personal_definition").any?
  end

  test "create when Claude is unavailable" do
    post vocabulary_word_definition_check_path(vocabulary_words(:mitigate)), headers: auth_headers

    assert_response :service_unavailable
  end

  test "create for another user's word" do
    post vocabulary_word_definition_check_path(vocabulary_words(:sam_lucid)), headers: auth_headers

    assert_response :not_found
  end
end
