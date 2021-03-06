'use strict';

/**
 * @ngdoc object
 * @name govright.platformServices.grEmbeddingParamsProvider
 * @header govright.platformServices.grEmbeddingParamsProvider
 *
 * @requires $rootElementProvider
 *
 * @description
 *
 * Enables setting a custom app root on the app startup and detecting whether app is in
 * embedded mode on the config stage.
 *
 * # Embedded application concept
 * Any GovRight AngularJS application can be delivered **either as** a stand-alone SPA under
 * it's own domain **or as** a widget embedded into another site. The `grEmbeddingParams`
 * service and it's provider are aimed to provide an easy way to detect if the current app is
 * embedded. Application is considered to be **not** embedded if it's root element is `html`.
 *
 * Example value of embedding params:
 * <pre>
 * {
    isEmbeddedMode: true, // This property is always present
    // Others are populated from the root element data attributes
    otherDataParam: 'value',
    ...
  }
 * </pre>
 */

/**
 * @ngdoc object
 * @name govright.platformServices.grEmbeddingParams
 * @header govright.platformServices.grEmbeddingParams
 *
 * @description
 * Is a plain object of embedding parameters which are passed from the outside of the app
 * through root element data attributes (`data-*`).
 *
 * # Embedded application concept
 * Any GovRight AngularJS application can be delivered **either as** a stand-alone SPA under
 * it's own domain **or as** a widget embedded into another site. The `grEmbeddingParams`
 * service and it's provider are aimed to provide an easy way to detect if the current app is
 * embedded. Application is considered to be **not** embedded if it's root element is `html`.
 *
 * # Important notes
 *
 * * Returned value always has the `isEmbeddedMode` property which is either true or false
 * and indicates if app is in embedded mode now.
 * * The `query` (`data-query=""`) param is treated in a special way and can be specified either
 * as query or as json object and is parsed into a plain object.
 *
 * For example, following embedded app:
 *
 * <pre>
 * <div ng-app="myApp" data-app-port="9000" data-locale="en" data-query="test=me&lets=go"></div>
 * </pre>
 *
 * Will produce the following embedded params:
 *
 * <pre>
 * angular
 *   .module('myApp')
 *   .controller('MyController', ['grEmbeddingParams', function(EmbeddingParams) {
 *     console.log(EmbeddingParams);
 *
 *     // Outputs the following:
 *     {
 *        isEmbeddedMode: true,
 *        appPort: '9000',
 *        locale: 'en',
 *        // `query` param is parsed into a plain object
 *        query: {
 *          test: 'me',
 *          lets: 'go'
 *        }
 *      }
 *
 *   }]);
 * </pre>
 *
 * If application is **not** embedded, i.e. bootstrapped on the `html` element:
 *
 * <pre>
 * <html ng-app="myApp">
 *   <head>...</head>
 *   <body>...</body>
 * </html>
 * </pre>
 *
 * The `grEmbeddingParams` value will be:
 *
 * <pre>
 * {
 *   isEmbeddedMode: false
 * }
 * </pre>
 */

/**
 * @ngdoc property
 * @name govright.platformServices.grEmbeddingParams#isEmbeddedMode
 * @propertyOf govright.platformServices.grEmbeddingParams
 * @type {Boolean}
 *
 * @description
 *
 * Is either `true` or `false` and indicates if app is in embedded mode now.
 */

(function() {
  angular
    .module('govright.platformServices')
    .provider('grEmbeddingParams', ['$injector', function($injector) {
      var embeddingParams, appRoot;
      var $rootElement = $injector.get('$rootElementProvider');

      /**
       * @ngdoc method
       * @name govright.platformServices.grEmbeddingParamsProvider#setAppRoot
       * @methodOf govright.platformServices.grEmbeddingParamsProvider
       *
       * @description
       *
       * Set an app root element. Root element defaults to angular `$rootElement`
       * if this method was not called on the app config stage. Example:
       *
       * <pre>
       * angular
       *   .module('myApp')
       *   .config(['$rootElementProvider', 'grEmbeddingParamsProvider',
       *     function($rootElementProvider, EmbeddingProvider) {
       *       EmbeddingProvider.setAppRoot($rootElementProvider);
       *   });
       * </pre>
       *
       * @param {Object} rootElement Root element, can be DOM element, angular element or `$rootElementProvider`
       */
      this.setAppRoot = function(rootElement) {
        if(rootElement.$get) {
          appRoot = rootElement.$get();
        } else {
          appRoot = rootElement;
        }
      };

      /**
       * @ngdoc method
       * @name govright.platformServices.grEmbeddingParamsProvider#getParams
       * @methodOf govright.platformServices.grEmbeddingParamsProvider
       *
       * @description
       *
       * Same as provider's **`$get()`**.
       *
       * Returns application embedding parameters which are passed from the outside of the app
       * through root element data attributes (`data-*`).
       *
       * **Important notes:**
       *
       * * Returned value always has the `isEmbeddedMode` property which is either true or false
       * and indicates if app is in embedded mode now.
       * * The `query` (`data-query=""`) param is treated in a special way and can be specified either
       * as query or as json object and is parsed into a plain object.
       *
       * <br>
       * For example, following embedded app:
       *
       * <pre>
       * <div ng-app="myApp" data-app-port="9000" data-locale="en" data-query="test=me&lets=go"></div>
       * </pre>
       *
       * Will produce the following embedded params:
       *
       * <pre>
       * {
       *   isEmbeddedMode: true,
       *   appPort: '9000',
       *   locale: 'en',
       *   query: {
       *     test: 'me',
       *     lets: 'go'
       *   }
       * }
       * </pre>
       *
       * Example of usage in app config block:
       * <pre>
       * angular
       *   .module('myApp')
       *   .config(['$rootElementProvider', 'grEmbeddingParamsProvider',
       *     function($rootElementProvider, EmbeddingProvider) {
       *
       *       if(EmbeddingProvider.getParams().isEmbeddedMode) {
       *         // do things specific for embedded mode
       *       }
       *
       *   });
       * </pre>
       *
       * @returns {Object} Plain object of application embedding parameters.
       */
      this.getParams = function() {
        if(!appRoot) {
          this.setAppRoot($rootElement);
        }
        appRoot = angular.element(appRoot)[0];
        if(!embeddingParams) {
          embeddingParams = {
            isEmbeddedMode: appRoot.tagName !== 'HTML'
          };
          if(embeddingParams.isEmbeddedMode) {
            [].forEach.call(appRoot.attributes, function(attr) {
              if(/^data-/.test(attr.name)) {
                var key = attr.name.replace('data-', '')
                  .replace(/-[a-z]/g, function(m) { return m[1].toUpperCase(); });
                embeddingParams[key] = attr.value;
              }
            });
          }
          if(embeddingParams.query) {
            if(embeddingParams.query.indexOf('{') === 0 || embeddingParams.query.indexOf('[') === 0) {
              embeddingParams.query = JSON.parse(embeddingParams.query);
            } else {
              var params = embeddingParams.query.split('&');
              embeddingParams.query = {};
              params.forEach(function(p) {
                var param = p.split('=');
                embeddingParams.query[param[0]] = param[1];
              });
            }
          }
        }
        return embeddingParams;
      };
      this.$get = this.getParams;
    }]);
}());
