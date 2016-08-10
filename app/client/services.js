angular.module('myApp').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getUserStatus: getUserStatus,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn() {
      if(user) {
        return true;
      } else {
        return false;
      }
    }

    function getUserStatus() {
      return $http.get('/user/status')
      // handle success
      .success(function (data) {
        if(data.status){
          user = true;
        } else {
          user = false;
        }
      })
      // handle error
      .error(function (data) {
        user = false;
      });
    }

    function login(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/login',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            user = true;
            // store username for later
            sessionStorage.user = JSON.stringify(username);
            deferred.resolve();
          } else {
            user = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/user/logout')
        // handle success
        .success(function (data) {
          user = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          user = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(username, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/user/register',
        {username: username, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

}]);

angular.module('myApp.services', []).
factory('mtgAPIservice', function($http) {

  var mtgAPI = {};

  mtgAPI.getCards = function(name) {
    return $http({
      method: 'GET',
      url: 'https://api.magicthegathering.io/v1/cards?name="' + name + '"'
    }).then(function successCallback(response) {
      return response;
    }, function errorCallback(response) {
      console.log(response);
    });
  };

  mtgAPI.getToken = function() {
    return $http({
      method: 'POST',
      url: 'https://www.echomtg.com/api/user/auth/&email=kevelberger@gmail.com&password=whitehorse9'
    }).then(function successCallback(response) {
      return response.data.token;
    }, function errorCallback(response) {
      console.log(response);
    });
  };

  mtgAPI.getPrice = function(multiverseID, token) {
    return $http({
      method: 'GET',
      url: 'https://www.echomtg.com/api/inventory/add/mid=' + multiverseID + '&auth=' + token
    }).then(function successCallback(response) {
      return response;
    }, function errorCallback(response) {
      console.log(response);
    });
  };

  return mtgAPI;
});