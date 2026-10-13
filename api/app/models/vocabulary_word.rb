class VocabularyWord < ApplicationRecord
  PARTS_OF_SPEECH = %w[ noun verb adjective adverb phrase other ]
  DEFINITION_VERDICTS = %w[ accurate partial inaccurate ]

  include DefinitionCheck

  belongs_to :user
  has_many :reviews, class_name: "VocabularyWord::Review", dependent: :destroy
  has_many :book_session_words, class_name: "BookSession::Word", dependent: :destroy

  enum :status, %w[ new learning practicing mastered ].index_by(&:itself), validate: true, scopes: false
  enum :confidence, %w[ low medium high ].index_by(&:itself), validate: true

  normalizes :word, with: ->(word) { word.strip.downcase }
  normalizes :part_of_speech, with: ->(pos) { pos.strip.downcase }

  validates :word, presence: true, uniqueness: { scope: :user_id }
  validates :part_of_speech, inclusion: { in: PARTS_OF_SPEECH }

  before_validation { self.learned_on ||= Date.current }

  scope :alphabetically, -> { order(:word) }
  scope :reverse_chronologically, -> { order(created_at: :desc, id: :desc) }
  scope :matching, ->(query) { where("word LIKE ?", "%#{sanitize_sql_like(query.downcase)}%") }

  def retention_rate
    uses_count.zero? ? nil : (correct_uses_count * 100 / uses_count)
  end

  def record(review)
    increment :uses_count
    increment :correct_uses_count if review.correct?
    self.context_sentence = review.sentence if review.usage? && review.correct?
    update! last_reviewed_at: review.created_at
  end
end
