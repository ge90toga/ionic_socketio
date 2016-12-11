### User number badge questions
The socket.io example provided in this example can update online user number
real time. I first examine the www/js/services.js file and 
I find User factory:
```javascript
.factory('Users', function($log){
    var usernames = [];
    usernames.numUsers = 0;

    return {
      getUsers: function(){
        return usernames;
      },
      addUsername: function(username){
        usernames.push(username);
      },
      deleteUsername: function(username){
        var index = usernames.indexOf(username);
        if(index != -1){
          usernames.splice(index, 1);
        }
      },
      setNumUsers: function(data){
        $log.info('user number set '+data.numUsers);
        usernames.numUsers = data.numUsers;
      }
  };
})
```
I found setNumUsers is called when (1) user logs in (2) other user joins/leave.
Here is the html template for user counting, data.numUser is bind with badge:
```html
  <ion-tab title="Contacts" badge="data.numUsers" badge-style="badge-positive" icon-off="ion-ios-people-outline" icon-on="ion-ios-people" href="#/tab/users" ng-controller="PeopleCtrl">
    <ion-nav-view name="tab-users"></ion-nav-view>
  </ion-tab>
```
So PeopleCtrl is bind with this view, when I examine the PeopleCtrl I find this:
```javascript
.controller('PeopleCtrl', function($scope, Users) {
  $scope.data = Users.getUsers();
})
```

My question is
(1) Looks to me that Users.getUsers() is just a function call which returns a 
usernames array assigned to $scope.data. But I suspect there is a data binding between 
$scope.data and Users.username here because if there is not there will be no explanation 
to why the user count can be updated real-time. Am I correct?
(2) usernames is any array, why not simply use array length to track user count rather than 
assign a numUsers property to it? It seems just weird.


Seems Like I have an answer to (1), the $scope.data = Users.getUsers() gets a reference of 'usernames' in User factory (copy by reference in javascript + closure). Therefore $scope.data and usernames points to the same memory address. 'usernames' updates is essentially updating $scope.data!  I wrote this to verify my reasoning:
```javascript
function User() {
    var usernames = [];
    usernames.numUsers = 0;
    // return an object
    return {
        getUsers: function(){
            return usernames;
        },
        addUsername: function(username){
            usernames.push(username);
        },
        deleteUsername: function(username){
            var index = usernames.indexOf(username);
            if(index != -1){
                usernames.splice(index, 1);
            }
        },
        setNumUsers: function(data){
            usernames.numUsers = data.numUsers;
        }
    };
}

var users = User();
var data = users.getUsers();
users.setNumUsers({numUsers:1});
console.log('number of users is: '+data.numUsers); //outputs 1
```


But that doesn't answer my second question. 

