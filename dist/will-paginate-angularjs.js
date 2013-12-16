/**
 * will-paginate-angularjs
 * @version v0.1.0 - 2013-12-16
 * @link https://github.com/heavysixer/will_paginate-angularjs
 * @author Mark Daggett <info@humansized.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function (window, document, undefined) {
  'use strict';
  angular.module('will_paginate', []);
  angular.module('will_paginate').run([
    '$templateCache',
    function ($templateCache) {
      $templateCache.put('template/will_paginate/paginator.html', '<ul class="{{options.paginationClass}}">' + '  <li class="prev" ng-class="{true:\'disabled\'}[params.currentPage == 1]"><span>{{options.previousLabel}}</span></li>' + '  <li ng-class="{active:params.currentPage == page.value, disabled:page.kind == \'gap\' }" ng-repeat-start="page in collection">' + '    <span ng-show="params.currentPage == page.value">{{page.value}}</span>' + '    <a ng-hide="params.currentPage == page.value" ng-click="getPage(page.value)">{{page.value}}</a>' + '  </li>' + '  <li ng-repeat-end></li>' + '  <li class="next" ng-class="{true:\'disabled\'}[params.currentPage == params.totalPages]">' + '    <a ng-hide="params.currentPage == params.totalPages" ng-click="getPage(params.currentPage + 1)">{{options.nextLabel}}</a>' + '    <span ng-show="params.currentPage == params.totalPages">{{options.nextLabel}}</span>' + '  </li>' + '</ul>');
    }
  ]).directive('willPaginate', function () {
    return {
      restrict: 'ACE',
      templateUrl: 'template/will_paginate/paginator.html',
      scope: {
        params: '=',
        config: '='
      },
      controller: [
        '$scope',
        function ($scope) {
          $scope.getPage = function (num) {
            console.log(num);
          };
        }
      ],
      link: function ($scope) {
        $scope.collection = [];
        $scope.config = {
          paginationClass: 'pagination',
          previousLabel: 'Previous',
          nextLabel: 'Next',
          innerWindow: 1,
          outerWindow: 2,
          linkSeperator: ' ',
          paramName: 'page',
          params: {},
          pageLinks: true,
          container: true
        };
        $scope.windowedPageNumbers = function () {
          var left = [];
          var middle = [];
          var right = [];
          var x;
          var windowFrom = $scope.params.currentPage - $scope.options.innerWindow;
          var windowTo = $scope.params.currentPage + $scope.options.innerWindow;
          if (windowTo > $scope.params.currentPage) {
            windowFrom -= windowTo - $scope.params.totalPages;
            windowTo = $scope.params.totalPages;
          }
          if (windowFrom < 1) {
            windowTo += 1 - windowFrom;
            windowFrom = 1;
            if (windowTo > $scope.params.totalPages) {
              windowTo = $scope.params.totalPages;
            }
          }
          for (x = windowFrom; x < windowTo; x++) {
            middle.push({ value: x });
          }
          if ($scope.options.outerWindow + 3 < middle[0].value) {
            for (x = 1; x < $scope.options.outerWindow + 1; x++) {
              left.push({ value: x });
            }
            left.push({
              value: '\u2026',
              kind: 'gap'
            });
          } else {
            for (x = 1; x < middle[0].value; x++) {
              left.push({ value: x });
            }
          }
          if ($scope.params.totalPages - $scope.options.outerWindow - 2 > middle[middle.length - 1].value) {
            right.push({
              value: '\u2026',
              kind: 'gap'
            });
            for (x = $scope.params.totalPages - $scope.options.outerWindow; x < $scope.params.totalPages; x++) {
              right.push({ value: x });
            }
          } else {
            for (x = middle[middle.length - 1].value + 1; x <= $scope.params.totalPages; x++) {
              right.push({ value: x });
            }
          }
          return left.concat(middle.concat(right));
        };
        $scope.render = function () {
          $scope.collection = $scope.windowedPageNumbers();
        };
        $scope.$watch('config', function (newVal) {
          if (typeof newVal === 'undefined') {
            return;
          }
          $scope.options = angular.extend(angular.copy($scope.config, {}), angular.copy(newVal, {}));
          if ($scope.params.currentPage) {
            $scope.render();
          }
        });
        $scope.$watch('params.currentPage', function (newVal) {
          if (typeof newVal === 'undefined') {
            return;
          }
          $scope.render();
        });
      }
    };
  });
}(window, document));