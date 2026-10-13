class Challenge::Submission < ApplicationRecord
  belongs_to :challenge
  belongs_to :user
  has_one :activity, as: :subject, dependent: :destroy

  validates :passage, presence: true
  validates :user_id, uniqueness: { scope: :challenge_id }

  before_save :score, if: :passage_changed?
  after_save_commit :record_activity

  def used_words
    rubric.select { |entry| entry["used"] }.pluck("word")
  end

  def passed?
    used_words.size >= challenge.target_count
  end

  private
    def score
      self.word_count = passage.split.size
      self.rubric = challenge.words.map do |word|
        { "word" => word, "used" => passage.match?(/\b#{Regexp.escape(word)}/i) }
      end
    end

    def record_activity
      (activity || build_activity(user: user, kind: "challenge")).update!(title: challenge.title, word_count: word_count,
        vocabulary_added: used_words.size, status: "#{passed? ? "Passed" : "Used"} #{used_words.size}/#{challenge.target_count}",
        occurred_at: Time.current)
    end
end
