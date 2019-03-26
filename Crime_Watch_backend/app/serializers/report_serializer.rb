class ReportSerializer < ActiveModel::Serializer

  belongs_to :user
  has_many :comments
  attributes :id, :lat, :lng, :description, :user_id

end
