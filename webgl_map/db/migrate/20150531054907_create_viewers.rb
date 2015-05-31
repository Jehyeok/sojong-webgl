class CreateViewers < ActiveRecord::Migration
  def change
    create_table :viewers do |t|

    	t.float :latitude
    	t.float :longitude
    	t.float :distance_from_bostacle

      t.timestamps
    end
  end
end
