module User::Progress
  extend ActiveSupport::Concern

  STREAK_HISTORY_DAYS = 14

  included do
    has_many :activities, dependent: :destroy
  end

  def words_written_since(time)
    activities.since(time).sum(:word_count)
  end

  def sessions_completed_count
    activities.count
  end

  def vocabulary_retention_rate
    uses, correct_uses = vocabulary_words.pick(Arel.sql("SUM(uses_count), SUM(correct_uses_count)"))
    uses.to_i.zero? ? nil : correct_uses * 100 / uses
  end

  def streak_history
    active_days = practice_days_since(STREAK_HISTORY_DAYS.days.ago.to_date)
    (STREAK_HISTORY_DAYS - 1).downto(0).map { |ago| active_days.include?(ago.days.ago.to_date) }
  end

  def streak_days
    active_days = practice_days_since(1.year.ago.to_date)
    day = active_days.include?(Date.current) ? Date.current : Date.yesterday

    streak = 0
    while active_days.include?(day)
      streak += 1
      day -= 1
    end
    streak
  end

  private
    def practice_days_since(date)
      activities.since(date.beginning_of_day).pluck(:occurred_at).map(&:to_date).to_set
    end
end
