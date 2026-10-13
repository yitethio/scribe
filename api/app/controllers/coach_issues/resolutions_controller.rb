class CoachIssues::ResolutionsController < ApplicationController
  before_action :set_coach_issue

  def create
    @coach_issue.resolve(revision: params[:revision])
    render "coach_issues/show", status: :created
  end

  def destroy
    @coach_issue.unresolve
    head :no_content
  end

  private
    def set_coach_issue
      @coach_issue = Current.user.coach_issues.find(params[:coach_issue_id])
    end
end
