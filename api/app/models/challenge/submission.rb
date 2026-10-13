class Challenge::Submission < ApplicationRecord
  NATURALNESS = %w[ natural awkward unnatural ]

  include Gradable

  belongs_to :challenge
  belongs_to :user
  has_one :activity, as: :subject, dependent: :destroy

  validates :passage, presence: true
  validates :user_id, uniqueness: { scope: :challenge_id }

  before_save { self.word_count = passage.split.size }
  after_save_commit :record_activity

  def used_words
    rubric.select { |entry| entry["used"] }.pluck("word")
  end

  # Words used correctly. Before Claude grades a passage, every used word counts.
  def scored_words
    rubric.select { |entry| entry["used"] && entry["correct"] != false }.pluck("word")
  end

  def passed?
    scored_words.size >= challenge.target_count
  end

  private
    def record_activity
      (activity || build_activity(user: user, kind: "challenge")).update!(title: challenge.title, word_count: word_count,
        vocabulary_added: scored_words.size, status: "#{passed? ? "Passed" : "Used"} #{scored_words.size}/#{challenge.target_count}",
        occurred_at: Time.current)
    end
end
