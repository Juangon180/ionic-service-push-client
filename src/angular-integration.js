// Add Angular integrations if Angular is available
if((typeof angular === 'object') && angular.module) {
  angular.module('ionic.service.push', [])

  /**
   * IonicPushAction Service
   * 
   * A utility service to kick off misc features as part of the Ionic Push service
   */
  .factory('$ionicPushAction', ['$state', function($state) {

    var IonicPushActionService = function(){};
    var IonicPushAction = IonicPushActionService.prototype;

    /**
     * State Navigation
     *
     * Attempts to navigate to a new view if a push notification payload contains:
     *
     *   - $state {String} The state name (e.g 'tab.chats')
     *   - $stateParams {Object} Provided state (url) params
     *
     * Find more info about state navigation and params: 
     * https://github.com/angular-ui/ui-router/wiki
     *
     */
    IonicPushAction.notificationNavigation = function(notification) {
      var state = false;
      var stateParams = {};
      
      try {
        state = notification.additionalData.payload.$state;
      } catch(e) {}

      try {
        stateParams = JSON.parse(notification.additionalData.payload.$stateParams);
      } catch(e) {}

      if (state) {
        $state.go(state, stateParams);
      }
    };

    return new IonicPushActionService();
  }])

  .factory('$ionicPushUtil', [
    function() {
      return {
        'Token': ionic.io.push.Token
      }
    }
  ])

  .factory('$ionicPush', [function() {
    var io = ionic.io.init();
    return io.push;
  }])

  .run(function($ionicPushAction) {
    // This is what kicks off the state redirection when a push notificaiton has the relevant details
    ionic.io.core.main.events.on('ionic_push:processNotification', function(notification) {
      if(notification.additionalData.foreground === false) {
        $ionicPushAction.notificationNavigation(notification);
      }
    });

  });
}
