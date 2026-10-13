class BookSession < ApplicationRecord
  belongs_to :user
  has_many :pages, -> { order(:number) }, dependent: :destroy
  has_many :words, dependent: :destroy
  has_many :vocabulary_words, -> { order("book_session_words.created_at") }, through: :words

  validates :book_title, presence: true
  validates :current_page, numericality: { greater_than: 0 }
  validates :zoom_level, numericality: { in: 25..400 }

  scope :latest, -> { order(updated_at: :desc, id: :desc) }

  def capture(word, context_sentence: nil)
    transaction do
      vocabulary_word = user.vocabulary_words.find_or_create_by!(word: word.to_s.strip.downcase) do |new_word|
        new_word.context_sentence = context_sentence.presence || "Encountered while reading #{book_title}."
      end
      words.find_or_create_by!(vocabulary_word: vocabulary_word)
      vocabulary_word
    end
  end
end
