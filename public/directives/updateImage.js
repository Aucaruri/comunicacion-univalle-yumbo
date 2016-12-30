(function () {
	'use strict';

	angular
		.module('app')
		.directive("updateImage", function() {
			return {
				restrict: 'E',
				templateUrl: function(elem,attr) {
					return '/public/directives/updateImage-' + attr.type + '.html';
				},
				link: function(scope, element, attrs) {
					$(function(){
						function cambiar(evt) {
							document.getElementById("uploadFile").value = this.files[0].name;
							var files = evt.target.files; // FileList object

							// Obtenemos la imagen del campo "archivo".
							for (var i = 0, f; f = files[i]; i++) {
								//Solo admitimos imágenes.
								if (!f.type.match('image.*')) {
									continue;
								}

								var reader = new FileReader();

								reader.onload = (function(theFile) {
									return function(e) {
										// Cambiamos la imagen
										$("#img_destino").attr({src:e.target.result, title:escape(theFile.name)});
									};
								})(f);

								reader.readAsDataURL(f);
							}
						}
					//Cada que seleccione una imagen se activa
					$("#archivo").change(cambiar);
					});
				}
			};
		});
})();