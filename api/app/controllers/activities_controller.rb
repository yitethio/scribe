class ActivitiesController < ApplicationController
  def index
    @activities = Current.user.activities.reverse_chronologically.limit(params.fetch(:limit, 50).to_i.clamp(1, 200))
    @activities = @activities.where(kind: params[:kind]) if params[:kind].present?
  end

  def create
    @activity = Current.user.activities.create!(params.permit(:kind, :title, :status, :word_count, :vocabulary_added,
      :duration_minutes, :occurred_at))
    render :show, status: :created
  end
end
