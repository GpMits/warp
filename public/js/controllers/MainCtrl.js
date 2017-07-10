angular.module('MainCtrl', []).controller('MainController', function ($rootScope, $scope, RestaurantService, ReviewService, UserService) {

    // Default position is London!
    $scope.myPos = {
        lat: 51.503186,
        lng: -0.126446
    };
    // Default user location
    $scope.userPos = {
        lat: 51.503186,
        lng: -0.126446
    };
    $scope.restInput = document.getElementById('rest-search');
    $scope.map = new google.maps.Map(document.getElementById('map'), {
        center: $scope.myPos,
        zoom: 15
    });

    $scope.markers = [];
    $scope.places = [];
    $scope.infoWindow = new google.maps.InfoWindow();
    $scope.service = new google.maps.places.PlacesService($scope.map);
    $scope.searchBox = new google.maps.places.SearchBox($scope.restInput);
    $scope.setStars = function (num) {
        if (!$scope.review) {
            $scope.review = {}
        }
        $scope.review.rating = num;
    }
    //Init Stars
    $scope.setStars(3);
    $scope.getNumber = function (num) {
        return new Array(num);
    }
    // Needed to handle map searchbox
    $scope.map.addListener('bounds_changed', function () {
        $scope.searchBox.setBounds($scope.map.getBounds());
    });

    // Needed to handle map searchbox
    $scope.searchBox.addListener('places_changed', function () {
        var places = $scope.searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        $scope.markers.forEach(function (marker) {
            marker.setMap(null);
        });
        $scope.markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
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

    //Map initialization
    $scope.init = function () {
        if ($rootScope.user == undefined) {
            $scope.noUserDetected = true;
        }
        $scope.map.controls[google.maps.ControlPosition.TOP_LEFT].push($scope.restInput);
        $scope.map.setOptions({
            styles: [{
                featureType: 'poi.business',
                stylers: [{
                    visibility: 'off'
                }]
            }]
        });
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.myPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                $scope.userPos = $scope.myPos;
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

    //-------------------------------------------------------------------------
    // Following two methods were extracted from: https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates
    // ----------------------------------------------------------------------
    function degreesToRadians(degrees) {
        return degrees * Math.PI / 180;
    }

    function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
        var earthRadiusKm = 6371;

        var dLat = degreesToRadians(lat2 - lat1);
        var dLon = degreesToRadians(lon2 - lon1);

        lat1 = degreesToRadians(lat1);
        lat2 = degreesToRadians(lat2);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return earthRadiusKm * c;
    }
    //-----------------------------------------------------------------------

    // Process nearbySearch results
    $scope.processResults = function (results, status) {
        $scope.places = [];
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
            console.error(status);
            return;
        }
        for (var i = 0, result; result = results[i]; i++) {
            $scope.addMarker(result);
            result.distance = distanceInKmBetweenEarthCoordinates($scope.userPos.lat,
                $scope.userPos.lng,
                result.geometry.location.lat(),
                result.geometry.location.lng()).toFixed(2);
            console.log(result);
            if (result.opening_hours) {
                if (result.opening_hours.open_now) {
                    result.opening_hours.open_now = "Yes";
                } else {
                    result.opening_hours.open_now = "No";
                }
            }
            var addToPlaces = function (result) {
                RestaurantService.getRestaurant(result.name).then(function (restaurant) {
                    result.average_rating = restaurant.average_rating.toFixed(2);;
                    $scope.places.push(result);
                }, function (reason) {
                    $scope.places.push(result);
                })
            }
            addToPlaces(result);

        }
    };

    $scope.addMarker = function (place) {
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: place.geometry.location,
            icon: {
                url: 'http://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png',
                //anchor: new google.maps.Point(16, 16),
                scaledSize: new google.maps.Size(20, 32)
            }
        });
        if ($scope.markers.length > 300) {
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
                if (place.photos) {
                    $scope.restPhoto = place.photos[0].getUrl({
                        maxWidth: 200,
                        maxHeight: 200
                    });
                } else {
                    $scope.restPhoto = "./img/no_image.png"
                }
                $scope.fetchAllReviews();
                $scope.commentFormShow = true;
            });
        });
    }

    // List row click
    $scope.clickRow = function (place) {
        $scope.restName = place.name;
        if (place.photos) {
            $scope.restPhoto = place.photos[0].getUrl({
                maxWidth: 200,
                maxHeight: 200
            });
        } else {
            $scope.restPhoto = "./img/no_image.png"
        }
        $scope.fetchAllReviews();
        $scope.commentFormShow = true;
    }

    // Called after user sent a new comment
    $scope.processComment = function () {
        restaurant = {
            "name": $scope.restName,
            "average_rating": $scope.review.rating
        }

        RestaurantService.getRestaurant($scope.restName).then(
            function (restObject) {
                UserService.getUser($rootScope.user).then(
                    function (user) {
                        review = {
                            "restaurant_id": restObject._id,
                            "user_id": user._id,
                            "comment": $scope.review.comment,
                            "rating": $scope.review.rating
                        }
                        ReviewService.createReview(review).then(
                            function (res) {
                                console.log("Reviewed!")
                                console.log(res);
                                $scope.review.comment = null;
                                $scope.fetchAllReviewsAndUpdate();
                            },
                            function (reason) {
                                console.error('Error while creating Review');
                            }
                        )
                    },
                    function (reason) {
                        console.error('Error while fetching user', reason);
                    }
                )
            },
            function (reason) {
                RestaurantService.createRestaurant(restaurant).then(
                    function (restObject) {
                        console.log("Restaurant inserted!");
                        UserService.getUser($rootScope.user).then(
                            function (user) {
                                review = {
                                    "restaurant_id": restObject._id,
                                    "user_id": user._id,
                                    "comment": $scope.review.comment,
                                    "rating": $scope.review.rating
                                }
                                ReviewService.createReview(review).then(
                                    function (res) {
                                        console.log("Reviewed!")
                                        console.log(res);
                                        $scope.review.comment = null;
                                        $scope.updateList(review.rating);
                                        $scope.fetchAllReviews();
                                    },
                                    function (reason) {
                                        console.error('Error while creating Review');
                                    }
                                )
                            },
                            function (reason) {
                                console.error('Error while fetching user', reason);
                            }
                        )
                    },
                    function (errResponse) {
                        console.error('Error while creating Restaurant');
                    }
                )
            }
        );

    }

    // Fetch reviews for restaurant review list
    $scope.fetchAllReviews = function () {
        $scope.reviewsList = [];
        ReviewService.getReview($scope.restName).then(
            function (res) {
                if (res.length > 0) {
                    res.forEach(function (r) {
                        UserService.getUserById(String(r.user_id)).then(
                            function (user) {
                                r.username = user.username;
                            },
                            function (reason) {
                                console.error('Error while fetching User: ', reason);
                                r.username = undefined;
                            }
                        )
                    }, this);
                    $scope.reviewsList = res;
                }
            },
            function (reason) {
                console.error('Error while fetching Reviews: ', reason);
            }
        )
    }

    // Fetch reviews for restaurant review list and recalculate average rating
    $scope.fetchAllReviewsAndUpdate = function () {
        $scope.reviewsList = [];
        console.log("entrou")
        ReviewService.getReview($scope.restName).then(
            function (res) {
                if (res.length > 0) {
                    var average_rating = 0;
                    res.forEach(function (r) {
                        average_rating += r.rating;
                        UserService.getUserById(String(r.user_id)).then(
                            function (user) {
                                r.username = user.username;
                            },
                            function (reason) {
                                console.error('Error while fetching User: ', reason);
                                r.username = undefined;
                            }
                        )

                    }, this);
                    average_rating = average_rating / res.length;
                    $scope.reviewsList = res;
                    restaurant = {
                        "name": $scope.restName,
                        "average_rating": average_rating
                    }
                    RestaurantService.updateRestaurant(restaurant).then(function (r) {
                        console.log("Restaurant Updated!")
                        $scope.updateList(restaurant.average_rating);
                    }, function (reason) {
                        console.error('Error while updating Restaurant: ', reason);
                    })
                }
            },
            function (reason) {
                console.error('Error while fetching Reviews: ', reason);
            }
        )
    }

    $scope.updateList = function(avg_rating){
        $scope.places.forEach(function (place) {
            if(place.name === $scope.restName){
                place.average_rating = avg_rating.toFixed(2);
            }
        });
    }

    $scope.sort = {
        active: '',
        descending: undefined
    }

    $scope.changeSorting = function (column) {

        var sort = $scope.sort;

        if (sort.active == column) {
            sort.descending = !sort.descending;

        } else {
            sort.active = column;
            sort.descending = false;
        }
    };

    $scope.getIcon = function (column) {

        var sort = $scope.sort;

        if (sort.active == column) {
            return sort.descending ?
                'glyphicon-chevron-up' :
                'glyphicon-chevron-down';
        }

        return 'glyphicon-star';
    }
});