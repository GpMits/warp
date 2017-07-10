# Reasonable Restaurants

This is an application that gets the nearby restaurants using the google API and manage comments and ratings for each restaurant.
A logged in user can see comments and ratings from other uses as well as insert new ones.

There are two types of views: the _map view, which displays the ratings and comments for the selected restaurant on the map, and the __list view_, which show all nearby restaurants and display details for the one that is clicked.

## Installation
1. Download the repository
2. Install npm modules: `npm install`
3. Start up the server: `npm start`
4. View in browser at `http://localhost:8080`

## Configuration
The application requires a mongodb instance running somewhere.
To set the mongodb url, you need to edit the variable `url` in `config/db.js` :

```json
module.exports = {
	url : 'mongodb://localhost:27017/warp',
	url_db_test : 'mongodb://localhost:27017/warp_test'
}
```
There is also the variable `url_db_test` which specifies the mongodb instance for the tests.

## Testing

There are implemented tests for the api.
In order to run the test suite, type: `npm test`.

## Continuous integration using circle-ci (NOT TESTED)
There is a CircleCi configuration file called `circle.yml`.
This file describes the steps that CircleCi will follow to build the application. 
It will basically do the following:
1. Run the application tests
2. Build a docker image of the application, using the Dockerfile
3. Push the image somewhere (NOT CONFIGURED), I suggest AWS ECR

