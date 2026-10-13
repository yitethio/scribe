class RevisionsController < ApplicationController
  def index
    @revisions = case params[:mastered]
    when "true"  then Revision.mastered_by(Current.user)
    when "false" then Revision.where.not(id: Revision.mastered_by(Current.user))
    else Revision.all
    end.order(:id)
  end

  def show
    @revision = Revision.find(params[:id])
  end
end
