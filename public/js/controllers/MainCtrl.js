angular.module('MainCtrl', []).controller('MainController', function($scope) {

	$scope.tagline = 'To the moon and back!';	
	$scope.myPos = { lat: 51.503186, lng: -0.126446 };
	$scope.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 51.503186, lng: -0.126446 },
            zoom: 15
    });
	
	$scope.infoWindow = new google.maps.InfoWindow();
	$scope.service = new google.maps.places.PlacesService($scope.map);
	$scope.init = function(){
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
          handleLocationError(false, $scope.infoWindow, map.getCenter());
        }
	}
	$scope.init();
	// The idle event is a debounced event, so we can query & listen without
	// throwing too many requests at the server.
	$scope.map.addListener('idle', function () {
		 var request = {
    		location: $scope.myPos,
    		radius: '5000',
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
				url: 'http://maps.gstatic.com/mapfiles/circle.png',
				//anchor: new google.maps.Point(16, 16),
				scaledSize: new google.maps.Size(20, 32)
			}
		});

		google.maps.event.addListener(marker, 'click', function () {
			$scope.service.getDetails(place, function (result, status) {
				if (status !== google.maps.places.PlacesServiceStatus.OK) {
					console.error(status);
					return;
				}
				$scope.infoWindow.setContent(result.name);
				$scope.infoWindow.open($scope.map, marker);
			});
		});
	}
});