class UserSerializer < ActiveModel::Serializer

  has_many :reports
  attributes :email

end
