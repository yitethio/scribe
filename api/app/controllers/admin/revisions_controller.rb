class Admin::RevisionsController < ApplicationController
  require_admin
  before_action :set_revision, only: %i[ show update destroy ]

  def index
    @revisions = Revision.order(:id)
  end

  def show
  end

  def create
    @revision = Revision.create!(revision_params)
    render :show, status: :created, location: [ :admin, @revision ]
  end

  def update
    @revision.update!(revision_params)
    head :no_content
  end

  def destroy
    @revision.destroy
    head :no_content
  end

  private
    def set_revision
      @revision = Revision.find(params[:id])
    end

    def revision_params
      params.permit(:original, :focus_segment, :category, :prompt, :expected_keyword, :hint, :explanation)
    end
end
