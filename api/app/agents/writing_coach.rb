class WritingCoach < ApplicationAgent
  inputs :draft

  instructions coach_level: -> { draft.coach_level }

  schema do
    array :issues do
      object do
        string :phrase, description: "The learner's exact words that the issue is about, copied character for character"
        string :category, enum: Draft::COACH_CATEGORIES
        string :badge, description: "A two or three word label, like Collocation or Weak transition"
        string :summary, description: "One sentence naming the problem"
        string :question, description: "A question that leads the learner to the fix"
        string :hint, description: "A nudge toward the fix that stops short of giving it"
        string :explanation, description: "Why it's a problem and the principle behind the fix"
        string :sample_fix, description: "Your own sentence on a different subject that shows the principle"
      end
    end
  end
end
