class CoachIssuesController < ApplicationController
  before_action :set_draft, only: %i[ index create ]
  before_action :set_coach_issue, only: %i[ show update destroy ]

  def index
    @coach_issues = @draft.coach_issues.chronologically.includes(:resolution)
    @coach_issues = params[:resolved] == "true" ? @coach_issues.resolved : @coach_issues.unresolved if params.key?(:resolved)
  end

  def show
  end

  def create
    @coach_issue = @draft.coach_issues.create!(coach_issue_params)
    render :show, status: :created, location: @coach_issue
  end

  def update
    @coach_issue.update!(coach_issue_params)
    head :no_content
  end

  def destroy
    @coach_issue.destroy
    head :no_content
  end

  private
    def set_draft
      @draft = Current.user.drafts.find(params[:draft_id])
    end

    def set_coach_issue
      @coach_issue = Current.user.coach_issues.find(params[:id])
    end

    def coach_issue_params
      params.permit(:phrase, :category, :category_color, :badge, :summary, :question, :hint, :explanation, :sample_fix)
    end
end
