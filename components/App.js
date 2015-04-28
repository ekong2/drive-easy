var React = require('react');

var Search = require('./Search');
var Map = require('./Map');
var CurrentLocation = require('./CurrentLocation');
var LocationList = require('./LocationList');


var App = React.createClass({

	getInitialState(){

		// Extract the favorite locations from local storage

		var favorites = [];
		var pLocation = {};
		pLocation.latitude = localStorage.getItem('latitude');
		pLocation.longitude = localStorage.getItem('longitude');

		if(localStorage.favorites){
			favorites = JSON.parse(localStorage.favorites);
		}

		//center at HR

		return {
			favorites: favorites,
			currentAddress: 'My Current Location',
			mapCoordinates: {
				lat: pLocation.latitude,
				lng: pLocation.longitude
			}
		};
	},

	toggleFavorite(address){

		if(this.isAddressInFavorites(address)){
			this.removeFromFavorites(address);
		}
		else{
			this.addToFavorites(address);
		}

	},

	addToFavorites(address){

		var favorites = this.state.favorites;

		if (favorites.length < 3){
			favorites.push({
				address: address,
				timestamp: Date.now()
			});

			this.setState({
				favorites: favorites
			});

			localStorage.favorites = JSON.stringify(favorites);
		}
	},

	removeFromFavorites(address){

		var favorites = this.state.favorites;
		var index = -1;

		for(var i = 0; i < favorites.length; i++){

			if(favorites[i].address == address){
				index = i;
				break;
			}

		}

		// If it was found, remove it from the favorites array

		if(index !== -1){
			
			favorites.splice(index, 1);

			this.setState({
				favorites: favorites
			});

			localStorage.favorites = JSON.stringify(favorites);
		}

	},

	isAddressInFavorites(address){

		var favorites = this.state.favorites;

		for(var i = 0; i < favorites.length; i++){

			if(favorites[i].address == address){
				return true;
			}

		}

		return false;
	},

	searchForAddress(address){
		
		var self = this;

		// We will use GMaps' geocode functionality,
		// which is built on top of the Google Maps API

		GMaps.geocode({
			address: address,
			callback: function(results, status) {

				if (status !== 'OK') return;

				var latlng = results[0].geometry.location;

				self.setState({
					currentAddress: results[0].formatted_address,
					mapCoordinates: {
						lat: latlng.lat(),
						lng: latlng.lng()
					}
				});

			}
		});

	},

	render(){

		return (

			<div>
				<h1>Drive Easy</h1>

				<Search onSearch={this.searchForAddress} />

				<Map lat={this.state.mapCoordinates.lat} lng={this.state.mapCoordinates.lng} />

				<CurrentLocation address={this.state.currentAddress} 
					favorite={this.isAddressInFavorites(this.state.currentAddress)} 
					onFavoriteToggle={this.toggleFavorite} />

				<LocationList locations={this.state.favorites} activeLocationAddress={this.state.currentAddress} 
					onClick={this.searchForAddress} />

			</div>

		);
	}

});

module.exports = App;