# Loads the sample data the scribe frontend ships with (src/store/initialData.js, exported to
# db/seeds/sample_data.json) under a demo account. Safe to run more than once.
#
#   bin/rails db:seed
#   Sign in with demo@scribe.test / password123

data = JSON.parse(Rails.root.join("db/seeds/sample_data.json").read)

ActiveRecord::Base.transaction do
  profile = data["user"]
  user = User.find_or_initialize_by(email_address: "demo@scribe.test")
  user.update!(name: profile["name"], password: "password123", role_title: profile["role"], level: profile["currentLevel"],
    weekly_goal: profile["weeklyGoal"], focus_title: profile.dig("currentFocus", "title"),
    focus_description: profile.dig("currentFocus", "description"),
    focus_recommendation: profile.dig("currentFocus", "recommendation"))

  data["skills"].each do |skill|
    record = user.skills.find_or_initialize_by(key: skill["id"])
    record.update!(name: skill["name"], score: skill["score"], previous_score: skill["score"] - skill["change"].to_i)
    record.focus if skill["focus"]
  end

  data["vocabulary"].each do |word|
    user.vocabulary_words.find_or_initialize_by(word: word["word"]).update!(
      part_of_speech: word["pos"], personal_definition: word["personalDef"], definition: word["correctDef"],
      example: word["example"], context_sentence: word["contextSentence"], collocations: word["collocations"],
      synonyms: word["synonyms"], status: word["status"], confidence: word["confidence"], uses_count: word["timesUsed"],
      correct_uses_count: word["timesUsedCorrectly"], learned_on: Date.parse(word["dateLearned"]))
  end

  book = data["bookSession"]
  book_session = user.book_sessions.find_or_initialize_by(book_title: book["bookTitle"])
  book_session.update!(author: book["author"], cover_url: book["coverUrl"], filename: book["filename"],
    current_page: book["currentPage"], total_pages: book["totalPages"], zoom_level: book["zoomLevel"],
    words_rewritten: book["wordsRewritten"], duration_seconds: book["sessionDuration"], draft_text: book["draftText"])
  book["bookPages"].each do |number, page|
    book_session.pages.find_or_initialize_by(number: number.to_i)
      .update!(chapter: page["chapter"], subhead: page["subhead"], paragraphs: page["paragraphs"])
  end
  book["sessionVocabulary"].each { |word| book_session.capture(word) }

  workspace = data["writingWorkspace"]
  draft = user.drafts.find_or_initialize_by(title: workspace["title"])
  draft.update!(body: workspace["text"], coach_enabled: workspace["coachEnabled"], coach_level: workspace["coachLevel"])
  workspace["issues"].each do |issue|
    coach_issue = draft.coach_issues.find_or_initialize_by(phrase: issue["phrase"])
    coach_issue.update!(category: issue["category"], category_color: issue["categoryColor"], badge: issue["badge"],
      summary: issue["summary"], question: issue["question"], hint: issue["hint"], explanation: issue["explanation"],
      sample_fix: issue["sampleFix"])
    coach_issue.resolve if issue["resolved"]
  end

  challenge = data["challenges"]
  Challenge.find_or_initialize_by(title: challenge["title"], theme: challenge["theme"]).update!(words: challenge["words"],
    target_count: challenge["targetCount"], starts_at: Time.current.beginning_of_week, due_at: Time.current.end_of_week)

  data["revisionQueue"].each do |revision|
    Revision.find_or_initialize_by(original: revision["original"]).update!(focus_segment: revision["focusSegment"],
      category: revision["category"], prompt: revision["prompt"], expected_keyword: revision["expectedKeyword"],
      hint: revision["hint"], explanation: revision["explanation"])
  end

  kinds = { "Book Session" => "book_session", "Weekly Challenge" => "challenge", "Writing Practice" => "writing", "Revision Lab" => "revision" }
  data["recentActivity"].each_with_index do |activity, index|
    user.activities.find_or_initialize_by(title: activity["title"]).update!(kind: kinds.fetch(activity["type"]),
      status: activity["status"], word_count: activity["wordCount"], vocabulary_added: activity["vocabAdded"],
      duration_minutes: activity["duration"].to_i, occurred_at: index.days.ago)
  end
end

puts "Seeded scribe sample data. Sign in with demo@scribe.test / password123"
