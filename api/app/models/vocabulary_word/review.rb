class VocabularyWord::Review < ApplicationRecord
  belongs_to :word, class_name: "VocabularyWord", foreign_key: :vocabulary_word_id

  enum :kind, %w[ recall usage selection transformation ].index_by(&:itself), validate: true

  validates :sentence, presence: true, if: :usage?

  before_validation :match_word, if: -> { usage? && !@graded }
  after_create { word.record(self) }

  # Claude judges a usage sentence before it's saved, so no transaction waits on it. Without Claude, a usage
  # sentence is correct when it contains the word. Other kinds are graded by the client.
  def grade
    return unless usage? && sentence.present?

    graded = UsageGrader.answer(review: self)
    self.correct = graded["correct"]
    self.feedback = graded["feedback"] unless LearnerText.new(sentence).rewritten_in?(graded["feedback"])
    @graded = true
  rescue ApplicationAgent::Unavailable
    @graded = false
  end

  private
    def match_word
      self.correct = sentence.to_s.downcase.include?(word.word)
    end
end
