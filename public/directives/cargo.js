angular
	.module('app')
	.directive('cargo', function() {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, elem, attrs, ngModel) {
				scope.$watch(attrs.ngModel, function() {
					var val=ngModel.$viewValue
					ngModel.$setValidity('cargo', val!=='Administrador' && val!=='administrador');
				});
			}
		};
	});