class Api::V1::ReportsController < ApplicationController
  def index
    @reports = Report.all
    render json: @reports
  end

  def new

  end

  def create
  @report = Report.new(report_params())
  @report.save

  render json: @reports
  end

  def show
    @report = Report.find(params["id"])
    render json: @report
  end

  def edit

  end

  def update

  end

  def destroy

  end


  private

  def report_params()
    params.require(:report).permit(:lat, :lng, :description, :user_id)
  end
end
