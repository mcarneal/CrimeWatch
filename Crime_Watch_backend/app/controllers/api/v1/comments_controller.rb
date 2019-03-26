class Api::V1::CommentsController < ApplicationController


def index
  @comments = Comment.all
  render json: @comments
end

def create
  @comment = Comment.create(comment: params['comment'], user_id: params['user_id'], report_id: params['report_id'])
end

end
