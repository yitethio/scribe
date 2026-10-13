class BookSession::Word < ApplicationRecord
  belongs_to :book_session, touch: true
  belongs_to :vocabulary_word
end
