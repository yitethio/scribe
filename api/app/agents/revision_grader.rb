class RevisionGrader < ApplicationAgent
  inputs :attempt

  schema do
    boolean :correct, description: "Whether the revision fixes the focus segment and reads as correct English"
    string :feedback, description: "Two or three sentences to the learner about their revision"
  end
end
