class ReportSerializer < ActiveModel::Serializer

  belongs_to :user
  attributes :lat, :lng, :description, :user_id

end
