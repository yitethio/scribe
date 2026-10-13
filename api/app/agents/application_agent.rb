# Every AI feature is an agent that answers one structured request: its instructions and request live in
# app/prompts/<agent>/, and its schema shapes the answer. Agents raise Unavailable when Claude can't answer,
# so callers can fall back or tell the learner to try later.
class ApplicationAgent < RubyLLM::Agent
  class Unavailable < StandardError; end

  model ENV.fetch("SCRIBE_AI_MODEL", "claude-opus-5-5"), provider: :anthropic

  def self.answer(**inputs)
    new(**inputs).answer
  end

  def initialize(**inputs)
    @inputs = inputs
    super
  end

  def request
    RubyLLM.render_prompt "#{self.class.name.underscore}/request", **@inputs
  end

  def answer
    ask(request).parsed or raise Unavailable, "#{self.class.name} returned no answer"
  rescue RubyLLM::Error, RubyLLM::ConfigurationError, Faraday::Error, JSON::ParserError => error
    raise Unavailable, error.message
  end
end
