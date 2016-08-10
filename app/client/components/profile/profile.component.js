angular.module('profile')
    .component('profile', {
        templateUrl: 'components/profile/profile.template.html',
        controller: function ProfileController($scope, $http) {
        this.decks = [];
        var that = this;

            // Retrieve all decks owned by authenticated user
            $http.get('/profile')
                .success(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        that.decks.push(data[i]);
                    }
                })
                .error(function(data) {
                    console.log(data);
                });

        }
    });