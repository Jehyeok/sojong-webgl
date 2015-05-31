class CreateObstacles < ActiveRecord::Migration
  def change
    create_table :obstacles do |t|

    	t.float :latitude
    	t.float :longitude

      t.timestamps
    end
  end
end
