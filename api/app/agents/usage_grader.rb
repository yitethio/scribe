class UsageGrader < ApplicationAgent
  inputs :review

  schema do
    boolean :correct, description: "Whether the sentence uses the word correctly and in a sense that fits"
    string :feedback, description: "One or two sentences to the learner about how they used the word"
  end
end
