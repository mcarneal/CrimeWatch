class CreateReports < ActiveRecord::Migration[5.2]
  def change
    create_table :reports do |t|
      t.string :location
      t.string :description
      t.boolean :law_enforcment_contacted
      t.integer :user_id

      t.timestamps
    end
  end
end
