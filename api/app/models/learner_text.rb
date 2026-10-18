# Text a learner wrote, which Scribe's AI may point at but never rewrite. #rewritten_in? catches output that
# reproduces one of the learner's sentences with edits, so callers can drop it before the learner sees it.
# Quoting the learner's exact words is fine.
class LearnerText
  SHARED_RUN = 5     # words in a row copied from a learner's sentence
  OVERLAP = 0.7      # share of a learner's sentence's content words reused
  CONTENT_WORDS = 3  # fewer than this and a sentence is too short to judge by overlap

  def initialize(text)
    @text = text.to_s
  end

  def rewritten_in?(output)
    candidates = sentences_in(without_exact_quotes(output.to_s))
    sentences.any? { |sentence| candidates.any? { |candidate| rewrite?(sentence, candidate) } }
  end

  private
    def sentences
      @sentences ||= sentences_in(@text)
    end

    def sentences_in(text)
      text.split(/(?<=[.!?:;])\s+|\n+/).map { |sentence| sentence.downcase.scan(/[[:alpha:]']+/) }.reject(&:empty?)
    end

    def without_exact_quotes(output)
      output.gsub(/["“”']([^"“”']+)["“”']/) { |quote| @text.downcase.include?($1.downcase.strip) ? " " : quote }
    end

    def rewrite?(sentence, candidate)
      sentence != candidate && (shares_a_run?(sentence, candidate) || overlap(sentence, candidate) >= OVERLAP)
    end

    def shares_a_run?(sentence, candidate)
      (sentence.each_cons(SHARED_RUN).to_a & candidate.each_cons(SHARED_RUN).to_a).any?
    end

    def overlap(sentence, candidate)
      words = content_words(sentence)
      words.size < CONTENT_WORDS ? 0 : (words & content_words(candidate)).size.fdiv(words.size)
    end

    def content_words(words)
      words.select { |word| word.size >= 3 }.uniq
    end
end
