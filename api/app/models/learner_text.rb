# Text a learner wrote, which Scribe's AI may point at but never rewrite. #rewritten_in? catches output that
# reproduces one of the learner's sentences with edits, so callers can drop it before the learner sees it.
# Quoting the learner's exact words is fine.
class LearnerText
  MINIMUM_WORDS = 4
  OVERLAP = 0.6

  def initialize(text)
    @text = text.to_s
  end

  def rewritten_in?(output)
    candidates = sentences_in(without_exact_quotes(output.to_s))

    sentences.any? do |sentence|
      candidates.any? { |candidate| candidate != sentence && overlap(sentence, candidate) >= OVERLAP }
    end
  end

  private
    def sentences
      @sentences ||= sentences_in(@text)
    end

    def sentences_in(text)
      text.split(/(?<=[.!?])\s+|\n+/).map { |sentence| words_in(sentence) }.select { |words| words.size >= MINIMUM_WORDS }
    end

    def words_in(text)
      text.downcase.scan(/[[:alpha:]']+/)
    end

    def without_exact_quotes(output)
      output.gsub(/["“”']([^"“”']+)["“”']/) { |quote| @text.downcase.include?($1.downcase.strip) ? " " : quote }
    end

    def overlap(sentence, candidate)
      (sentence & candidate).size.fdiv([ sentence.uniq.size, candidate.uniq.size ].min)
    end
end
