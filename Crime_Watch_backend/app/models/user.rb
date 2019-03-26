class User < ApplicationRecord
  has_many :reports
  has_many :comments
end
