class Drafts::CoachingsController < ApplicationController
  def create
    @draft = Current.user.drafts.find(params[:draft_id])
    @draft.coach
    @coach_issues = @draft.coach_issues.chronologically.includes(:resolution)
    render "coach_issues/index", status: :created, location: draft_coach_issues_url(@draft)
  end
end
