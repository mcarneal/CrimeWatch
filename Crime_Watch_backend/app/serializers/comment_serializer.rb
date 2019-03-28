class CommentSerializer < ActiveModel::Serializer
  belongs_to :user
  belongs_to :report

  attributes :id, :comment, :user_id, :report_id , :user_email

  def user_email
    self.object.user.email

  end
end
