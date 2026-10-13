class ChallengeGrader < ApplicationAgent
  inputs :submission

  schema do
    array :words do
      object do
        string :word, description: "The target word, exactly as given"
        boolean :used, description: "Whether the passage uses the word, in any inflected form"
        boolean :correct, description: "Whether every use is grammatically correct. False when the word isn't used"
        string :natural, enum: Challenge::Submission::NATURALNESS
        string :note, description: "One or two sentences to the learner on how they used the word"
      end
    end
  end
end
