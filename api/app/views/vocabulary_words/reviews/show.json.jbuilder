json.partial! "vocabulary_words/reviews/review", review: @review
json.vocabulary_word do
  json.partial! "vocabulary_words/vocabulary_word", vocabulary_word: @review.word
end
