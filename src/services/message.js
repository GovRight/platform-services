'use strict';

/**
 * @ngdoc object
 * @name govright.llServices.llMessage
 * @header govright.llServices.llMessage
 * @object
 *
 * @description
 *
 * Various site messages, like 404, dialog popups, success toast, etc.
 */

(function () {
  angular
    .module('govright.llServices')
    .factory('llMessage', ['$mdToast', '$mdDialog', '$state', Message]);

  function Message($mdToast, $mdDialog, $state) {
    return {

      /**
       * @ngdoc method
       * @name govright.llServices.llMessage#error404
       * @methodOf govright.llServices.llMessage
       *
       * @description
       *
       * Display the 404 error page.
       *
       * Transitions to the 404 page without changing the url.
       * Requires the `site.404` route to be set up.
       *
       * Example route:
       *
       * ```
       * .state('site.404', {
       *   params: { message: undefined },
       *   templateUrl: '/templates/site/404.html',
       *   controller: 'StaticPageController'
       * })
       * ```
       *
       * @param {String=} message Custom message to display on the 404 page
       */
      error404: function (message) {
        $state.transitionTo('site.404', {message: message}, {location: false, inherit: true});
      },

      /**
       * @ngdoc method
       * @name govright.llServices.llMessage#transition
       * @methodOf govright.llServices.llMessage
       *
       * @description
       *
       * Display a site message as a separate page.
       *
       * Transitions to the site message page without changing the url.
       * Requires the `site.message` route to be set up.
       *
       * Example route:
       *
       * ```
       * .state('site.message', {
       *   params: { title: undefined, message: undefined },
       *   templateUrl: '/templates/site/message.html',
       *   controller: 'StaticPageController'
       * })
       * ```
       *
       * @param {String} title Title of the message
       * @param {String=} message Message text
       */
      transition: function (title, message) {
        $state.transitionTo('site.message',
          {
            title: title,
            message: message
          }, {location: false, inherit: true});
      },

      /**
       * @ngdoc method
       * @name govright.llServices.llMessage#success
       * @methodOf govright.llServices.llMessage
       *
       * @description
       *
       * Display a success message in a toast.
       *
       * @param {String=} [content=Action successfully complete] Success message text
       */
      success: function (content) {
        $mdToast.show(
          $mdToast.simple()
            .content(content || 'Action successfully complete')
            .position('bottom right')
            .hideDelay(3000)
        );
      },

      /**
       * @ngdoc method
       * @name govright.llServices.llMessage#error
       * @methodOf govright.llServices.llMessage
       *
       * @description
       *
       * Display an error message in a dialog.
       *
       * @param {String=} [title=An error occurred] Error message title
       * @param {String|Object=} content Error message text or an error object
       * @param {String=} [ok=Close] Close button text
       */
      error: function (title, content, ok) {
        var msg;
        if(typeof content === 'object') {
          if(content.data && content.data.error && content.data.error.message) {
            msg = content.data.error.message;
          } else {
            msg = content.message || '';
          }
        } else {
          msg = content || '';
        }
        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title(title)
            .content(msg)
            .ok(ok || 'Close')
        );
      },

      /**
       * @ngdoc method
       * @name govright.llServices.llMessage#confirm
       * @methodOf govright.llServices.llMessage
       *
       * @description
       *
       * Display a confirm/action request.
       *
       * Example:
       *
       * ```
       * llMessage.confirm().then(function() {
       *   // User clicked `Ok`
       * }).catch(function() {
       *   // User canceled
       * });
       * ```
       *
       * @param {String=} [title=Are you sure?] Confirm message
       * @param {String=} [ok=Ok] `Ok` button text
       * @param {String=} [cancel=Cancel] `Cancel` button text
       */
      confirm: function (title, ok, cancel) {
        var confirm = $mdDialog.confirm()
          .title(title || 'Are you sure?')
          .targetEvent()
          .ok(ok || 'Ok')
          .cancel(cancel || 'Cancel');
        return $mdDialog.show(confirm);
      }
    };
  }
})();
