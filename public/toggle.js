(function(){
	angular.module('app').animation('.slide-toggle', ['$animateCss', function($animateCss) {
		return {
			addClass: function(element, className, doneFn) {
				if (className == 'ng-hide') {
					var animator = $animateCss(element, {                    
						to: {height: '0px', opacity: 0}
					});
					if (animator) {
						return animator.start().finally(function() {
							element[0].style.height = '';
							doneFn();
						});
					}
				}
				doneFn();
			},
			removeClass: function(element, className, doneFn) {
				if (className == 'ng-hide') {
					var height = element[0].offsetHeight;
					var animator = $animateCss(element, {
						from: {height: '0px', opacity: 0},
						to: {height: height + 'px', opacity: 1}
					});
					if (animator) {
					 return animator.start().finally(doneFn);
					}
				}
				doneFn();
			}
		};
	}]);
})();