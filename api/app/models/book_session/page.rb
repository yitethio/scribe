class BookSession::Page < ApplicationRecord
  belongs_to :book_session

  validates :number, numericality: { greater_than: 0 }, uniqueness: { scope: :book_session_id }
end
