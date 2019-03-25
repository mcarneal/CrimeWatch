class ReportSerializer < ActiveModel::Serializer
  attributes :id, :location, :description, :law_enforcment_contacted, :user_id
end
