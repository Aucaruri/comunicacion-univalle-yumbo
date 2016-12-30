(function () {
	'use strict';

	angular
		.module('app')
		.directive('showImage', function() {
			return {
				restrict: 'E',
				templateUrl: '/public/directives/showImage.html',
				link: function (scope, element, attrs) {
					$(function(){
						function cambiar(evt) {
							document.getElementById("uploadFile").value = this.files[0].name;
							var files = evt.target.files; // FileList object

							// Obtenemos la imagen del campo "file".
							for (var i = 0, f; f = files[i]; i++) {
								//Solo admitimos imágenes.
								if (!f.type.match('image.*')) {
									continue;
								}

								var reader = new FileReader();

								reader.onload = (function(theFile) {
									return function(e) {
										// Insertamos la imagen
										document.getElementById("img_destino").innerHTML = ['<img class="m-b-5" width="100%" src="', e.target.result,'" title="', escape(theFile.name), '" alt="', escape(theFile.name),'"/>'].join('');
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