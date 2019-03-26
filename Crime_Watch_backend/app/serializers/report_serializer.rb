class ReportSerializer < ActiveModel::Serializer

  belongs_to :user
  attributes :id, :lat, :lng, :description, :user_id

end
