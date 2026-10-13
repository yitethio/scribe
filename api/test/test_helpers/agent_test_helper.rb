# Tests never call Claude. An agent raises ApplicationAgent::Unavailable unless the test gives it an answer:
#
#   answer WritingCoach, with: { "issues" => [] }
#   answer WritingCoach, with: ->(draft:) { { "issues" => [] } }
module AgentTestHelper
  mattr_accessor :answers, default: {}

  module StubbedAnswers
    def answer(**inputs)
      answer = AgentTestHelper.answers.fetch(self) { raise ApplicationAgent::Unavailable, "No answer for #{name} in this test" }
      answer.respond_to?(:call) ? answer.call(**inputs) : answer.deep_stringify_keys
    end
  end

  def answer(agent, with:)
    AgentTestHelper.answers[agent] = with
  end

  def self.included(test_case)
    test_case.teardown { AgentTestHelper.answers.clear }
  end
end

ApplicationAgent.singleton_class.prepend AgentTestHelper::StubbedAnswers

# Agents can be built and inspected in tests without a real key.
RubyLLM.config.anthropic_api_key = "test-key"

ActiveSupport.on_load(:active_support_test_case) { include AgentTestHelper }
