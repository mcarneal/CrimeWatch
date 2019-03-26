class UserSerializer < ActiveModel::Serializer

  has_many :reports
  has_many :comments
  attributes :id, :email

end
