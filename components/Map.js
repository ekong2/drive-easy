var React = require('react');

var Map = React.createClass({

	componentDidMount(){

		// Only componentDidMount is called when the component is first added to
		// the page. This is why we are calling the following method manually. 
		// This makes sure that our map initialization code is run the first time.

		this.componentDidUpdate();
	},

	componentDidUpdate(){

		if(this.lastLat == this.props.lat && this.lastLng == this.props.lng){

			// The map has already been initialized at this address.
			// Return from this method so that we don't reinitialize it
			// (and cause it to flicker).

			return;
		}

		this.lastLat = this.props.lat;
		this.lastLng = this.props.lng

		var map = new GMaps({
			el: '#map',
			lat: this.props.lat,
			lng: this.props.lng
		});

		map.addMarker({
			lat:localStorage.getItem('latitude'),
			lng:localStorage.getItem('longitude')
		})
		
		// Adding a marker to the location we are showing
		map.addMarker({
			lat: this.props.lat,
			lng: this.props.lng
		});

		// Drawing the route from origin to destination
		map.drawRoute({
		  origin: [localStorage.getItem('latitude'), localStorage.getItem('longitude')],
		  destination: [this.props.lat, this.props.lng],
		  travelMode: 'driving',
		  strokeColor: '#131540',
		  strokeOpacity: 0.6,
		  strokeWeight: 6
		});

		//adjusting the zoom on the map
		map.fitZoom();
	},

	render(){

		return (
			<div className="map-holder">
				<p>Loading...</p>
				<div id="map"></div>
			</div>
		);
	}

});

module.exports = Map;