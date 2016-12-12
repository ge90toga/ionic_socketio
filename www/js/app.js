angular.module('chat', ['ionic', 'btford.socket-io', 'chat.controllers', 'chat.services'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleLightContent();
      }
    });
  })

  // Hide tab directive, to hide the tab when chat or other view is on
  // 1. tabs.html add {{$root.hideTabs}} in <ion-tab>'s class attribute
  // 2. use hide-tabs directive whenever you need to hide tab (chat-detail.html)
  .directive('hideTabs', function($rootScope) {
    return {
      restrict: 'A',
      link: function($scope) {
        $rootScope.hideTabs = 'tabs-item-hide';
        $scope.$on('$destroy', function() {
          $rootScope.hideTabs = '';
        });
      }
    };
  })

  .config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

    $ionicConfigProvider.views.transition('none');

    $stateProvider

    // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:
      .state('tab.chatlist', {
        url: '/chatlist',
        views: {
          'tab-chatlist': {
            templateUrl: 'templates/tab-chatlist.html',
            controller: 'ChatListCtrl'
          }
        }
      })

      // .state('tab.chats', {
      //   url: '/chats/{username}',
      //   params: {username: {value: null}},
      //   views: {
      //     'tab-chats': {
      //       //templateUrl: 'templates/tab-chats.html',
      //       templateUrl: 'templates/tab-chat-temp.html',
      //       controller: 'ChatCtrl'
      //     }
      //   }
      // })
      .state('tab.chat-detail', {
        url: '/chats/{username}',
        params: {username: {value: null}},
        views: {
          'tab-chatlist': {
            templateUrl: 'templates/chat-detail.html',
            controller: 'ChatCtrl'
          }
        }
      })

      .state('tab.users', {
        url: '/users',
        views: {
          'tab-users': {
            templateUrl: 'templates/tab-users.html'
          }
        }
      })

      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/chatlist');

  });
