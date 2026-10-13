class DefinitionChecker < ApplicationAgent
  inputs :word

  schema do
    string :part_of_speech, enum: VocabularyWord::PARTS_OF_SPEECH
    string :definition, description: "A clear dictionary definition, in the sense the learner met the word"
    string :example, description: "Your own example sentence that uses the word naturally"
    array :collocations, of: :string, description: "Two to four common collocations"
    array :synonyms, of: :string, description: "Two to four synonyms"
    string :verdict, enum: VocabularyWord::DEFINITION_VERDICTS
    string :feedback, description: "Two or three sentences to the learner about their definition"
  end
end
