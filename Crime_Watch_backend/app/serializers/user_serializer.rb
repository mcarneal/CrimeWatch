class UserSerializer < ActiveModel::Serializer

  has_many :reports
  attributes :id, :email

end
