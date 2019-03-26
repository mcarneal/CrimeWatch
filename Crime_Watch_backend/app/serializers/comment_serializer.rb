class CommentSerializer < ActiveModel::Serializer
  belongs_to :user
  belongs_to :report

  attributes :id, :comment, :user_id, :report_id 
end
