class MapController < ApplicationController
	skip_before_filter  :verify_authenticity_token

	def index
		viewer = Viewer.find(1)
		viewer.distance_from_bostacle = 100.0
		viewer.save!
	end

	def create_viewer
		viewer = Viewer.create({
			latitude: 0.0,
			longitude: 0.0,
			distance_from_bostacle: 0.0
		})

		if viewer.save
			render plain: "success"
		else
			render plain: "fail"
		end
	end

	def update_gps
		puts "lat: #{params[:gps_lat]}, long: #{params[:gps_long]}";

		viewer = Viewer.find(1);
		viewer[:latitude] = params[:gps_lat]
		viewer[:longitude] = params[:gps_long]
		viewer[:distance_from_bostacle] = params[:distance].strip

		if viewer.save
			render plain: "success"
		else
			render plain: "fail"
		end		
	end

	def get_viewer_pos
		viewer = Viewer.find(1)
		render json: viewer
	end
end