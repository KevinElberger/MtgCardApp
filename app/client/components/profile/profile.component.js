angular.module('profile')
    .component('profile', {
        templateUrl: 'components/profile/profile.template.html',
        controller: function ProfileController($scope, $http) {
            $scope.decks = [];
            $scope.user = JSON.parse(sessionStorage.user);
            // Retrieve all decks owned by authenticated user
            $http.get('/profile/' + $scope.user)
                .success(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.decks.push(data[i]);
                    }
                })
                .error(function (data) {
                    console.log(data);
                });

            // Delete selected deck
            $scope.delete = function(id, index) {
                $http.delete('/profile/' + id)
                    .success(function(data) {
                        console.log(data);
                    })
                    .error(function(data) {
                        console.log(data);
                    });
                $scope.removeItem(index);
            };

            $scope.removeItem = function(index) {
                $scope.decks.splice(index,1);
            }
        }
    });