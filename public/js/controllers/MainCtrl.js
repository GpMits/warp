angular.module('MainCtrl', []).controller('MainController', function($scope, RestaurantService, ReviewService) {

	//Default position is London!
	$scope.myPos = { lat: 51.503186, lng: -0.126446 };
	$scope.restInput = document.getElementById('rest-search');
	$scope.map = new google.maps.Map(document.getElementById('map'), {
            center: $scope.myPos,
            zoom: 15
    });
	$scope.markers = []
	$scope.infoWindow = new google.maps.InfoWindow();
	$scope.service = new google.maps.places.PlacesService($scope.map);
	$scope.searchBox = new google.maps.places.SearchBox($scope.restInput);

	$scope.map.addListener('bounds_changed', function() {
         $scope. searchBox.setBounds($scope.map.getBounds());
    });

	$scope.searchBox.addListener('places_changed', function() {
		var places = $scope.searchBox.getPlaces();
		if (places.length == 0) {
			return;
		}

		// Clear out the old markers.
		$scope.markers.forEach(function(marker) {
			marker.setMap(null);
		});
		$scope.markers = [];

		// For each place, get the icon, name and location.
		var bounds = new google.maps.LatLngBounds();
		places.forEach(function(place) {
			if (!place.geometry) {
				console.log("Returned place contains no geometry");
				return;
			}

			// Create a marker for each place.
			$scope.markers.push(new google.maps.Marker({
				map: $scope.map,
				icon: null,
				title: place.name,
				position: place.geometry.location
			}));

			if (place.geometry.viewport) {
				// Only geocodes have viewport.
				bounds.union(place.geometry.viewport);
			} else {
				bounds.extend(place.geometry.location);
			}
		});

		$scope.map.fitBounds(bounds);
		var request = {
    		bounds: bounds,
    		radius: '1000',
    		types: ['restaurant']
  		};
        $scope.service.nearbySearch(request, $scope.processResults)
	});

	$scope.init = function(){
        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push($scope.restInput);
		$scope.map.setOptions({styles: [
          {
            featureType: 'poi.business',
            stylers: [{visibility: 'off'}]
          }
        ]});
		if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
            $scope.myPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            $scope.infoWindow.setPosition($scope.myPos);
            $scope.infoWindow.setContent('You are here!');
            $scope.map.setCenter($scope.myPos);
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, $scope.infoWindow, $scope.map.getCenter());
        }
	}
	$scope.init();

	// The idle event is a debounced event, so we can query & listen without
	// throwing too many requests at the server.
	$scope.map.addListener('idle', function () {
		$scope.myPos = $scope.map.getCenter()
		
		var request = {
    		location: $scope.myPos,
    		radius: '1000',
    		types: ['restaurant']
  		};

        $scope.service.nearbySearch(request, $scope.processResults)
	});

	$scope.processResults = function (results, status) {
		if (status !== google.maps.places.PlacesServiceStatus.OK) {
			console.error(status);
			return;
		}
		for (var i = 0, result; result = results[i]; i++) {
			$scope.addMarker(result);
		}
	};

	$scope.addMarker = function(place) {
		var marker = new google.maps.Marker({
			map: $scope.map,
			position: place.geometry.location,
			icon: {
				url: 'http://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png',
				//anchor: new google.maps.Point(16, 16),
				scaledSize: new google.maps.Size(20, 32)
			}
		});
		if($scope.markers.length > 300){
			$scope.markers[0].setMap(null);
			$scope.markers.splice(0, 1);
		}
		$scope.markers.push(marker)

		google.maps.event.addListener(marker, 'click', function () {
			$scope.service.getDetails(place, function (result, status) {
				if (status !== google.maps.places.PlacesServiceStatus.OK) {
					console.error(status);
					return;
				}
				$scope.restName = place.name;
				$scope.fetchAllreviews();
				$scope.commentFormShow = true;
			});
		});
	}

	$scope.processComment = function() {
		restaurant = {
			"name" : $scope.restName
		}
		
		RestaurantService.getRestaurant(restaurant.name).then(
			function(restObject){
				console.log("akii", restObject);
				review = {
					"restaurant_id" : restObject._id,
					"user_id" : "123",
					"comment" : $scope.review.comment,
					"rating" : $scope.review.rating
				}
				ReviewService.createReview(review).then(
					function(res){
						console.log("Reviewed!")
						console.log(res);
						$scope.fetchAllreviews();
					},
					function(reason){
						console.error('Error while creating Review');
					}
				)
			},
			function(reason){
				RestaurantService.createRestaurant(restaurant).then(
					function(restObject){
						console.log("Restaurant inserted!")
						review = {
							"restaurant_id" : restObject._id,
							"user_id" : "123",
							"comment" : $scope.review.comment,
							"rating" : Number($scope.review.rating)
						}
						ReviewService.createReview(review).then(
							function(res){
								console.log("Reviewed!");
								console.log(res);
								$scope.fetchAllreviews();
							},
							function(reason){
								console.error('Error while creating Review');
							}
						)
					},
					function(errResponse){
						console.error('Error while creating Restaurant');
					}
				)
			}
		);
			
	}

	$scope.fetchAllreviews = function(){
		$scope.reviewsList = [];
		ReviewService.getReview($scope.restName).then(
			function(res){
				$scope.reviewsList = res;
			},
			function(reason){
				console.error('Error while fetching Reviews: ', reason);
			}
		)
	}
});