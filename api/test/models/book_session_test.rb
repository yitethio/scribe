require "test_helper"

class BookSessionTest < ActiveSupport::TestCase
  test "capturing a new word adds it to the vocabulary and the session" do
    session = book_sessions(:craft_of_prose)

    assert_difference -> { users(:alex).vocabulary_words.count } do
      session.capture("Precipice", context_sentence: "The knight approached the precipice.")
    end

    assert_equal %w[ undermine precipice ], session.vocabulary_words.pluck(:word)
    assert_equal "The knight approached the precipice.", users(:alex).vocabulary_words.find_by(word: "precipice").context_sentence
  end

  test "capturing a known word reuses it and is idempotent" do
    session = book_sessions(:craft_of_prose)

    assert_no_difference -> { VocabularyWord.count } do
      2.times { session.capture("mitigate") }
    end

    assert_equal %w[ undermine mitigate ], session.vocabulary_words.pluck(:word)
  end
end
