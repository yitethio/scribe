# Every AI feature is an agent that answers one structured request: its instructions and request live in
# app/prompts/<agent>/, and its schema shapes the answer. Agents raise Unavailable when the model can't answer,
# so callers can fall back or tell the learner to try later.
class ApplicationAgent < RubyLLM::Agent
  class Unavailable < StandardError; end

  DEFAULT_MODELS = { "anthropic" => "claude-opus-5-5", "gemini" => "gemini-pro-latest" }
  PROVIDER = ENV.fetch("SCRIBE_AI_PROVIDER", "anthropic")

  model ENV.fetch("SCRIBE_AI_MODEL") { DEFAULT_MODELS.fetch(PROVIDER) }, provider: PROVIDER.to_sym
  max_output_tokens 16_000

  def self.answer(**inputs)
    new(**inputs).answer
  rescue RubyLLM::Error, RubyLLM::ConfigurationError, Faraday::Error, JSON::ParserError => error
    raise Unavailable, error.message
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
  end
end
