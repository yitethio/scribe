class VocabularyWord::Review < ApplicationRecord
  belongs_to :word, class_name: "VocabularyWord", foreign_key: :vocabulary_word_id

  enum :kind, %w[ recall usage selection transformation ].index_by(&:itself), validate: true

  validates :sentence, presence: true, if: :usage?

  before_validation :grade_usage, if: :usage?
  after_create { word.record(self) }

  private
    def grade_usage
      self.correct = sentence.to_s.downcase.include?(word.word)
    end
end
