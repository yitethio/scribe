class DraftsController < ApplicationController
  before_action :set_draft, only: %i[ show update destroy ]

  def index
    @drafts = Current.user.drafts.latest
  end

  def show
  end

  def create
    @draft = Current.user.drafts.create!(draft_params)
    render :show, status: :created, location: @draft
  end

  def update
    @draft.update!(draft_params)
    head :no_content
  end

  def destroy
    @draft.destroy
    head :no_content
  end

  private
    def set_draft
      @draft = Current.user.drafts.find(params[:id])
    end

    def draft_params
      params.permit(:title, :body, :coach_enabled, :coach_level)
    end
end
