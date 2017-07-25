      function grab_image(image_path, img){
      // Use a native XHR so we can use custom responseType
      var xhr = new XMLHttpRequest();
      xhr.open("GET", image_path, true);

      // Ask for the result as an ArrayBuffer.
      xhr.responseType = "arraybuffer";

      xhr.onload = function( e ) {
      // Obtain a blob: URL for the image data to draw it
      var arrayBufferView = new Uint8Array( this.response );
      var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
      var imageUrl = URL.createObjectURL( blob );
      img.src = imageUrl;

      // Get the description from S3 metadata
      var desc = this.getResponseHeader('x-server');
      img.setAttribute('alt', desc);
      img.alt = desc;      
      };
      xhr.send();
      }

      function grab_svg(image_path, svg, width, height){
      // Use a native XHR so we can use custom responseType
      var xhr = new XMLHttpRequest();
      xhr.open("GET", image_path + '?' + (new Date).getTime(), true);

      // Ask for the result as an ArrayBuffer.
      xhr.responseType = "arraybuffer";

      xhr.onload = function( e ) {
      // Obtain a blob: URL for the image data to draw it
      var arrayBufferView = new Uint8Array( this.response );
      var content_type = this.getResponseHeader('Content-type');            
      var blob = new Blob( [ arrayBufferView ], { type: content_type } );
      var imageUrl = URL.createObjectURL( blob );
      var svgImage = document.createElementNS('http://www.w3.org/2000/svg','image');
      svgImage.setAttribute('width',width);
      svgImage.setAttribute('height',height);
      svgImage.setAttributeNS('http://www.w3.org/1999/xlink',
      'href',
      imageUrl);
      svg.appendChild(svgImage);

      var svgRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
      svgRect.setAttribute('width',width);
      svgRect.setAttribute('height',height);
      var color = this.getResponseHeader('x-color');      
      svgRect.setAttribute('fill','#' + color);
      svgRect.setAttribute('fill-opacity','0.3');
      svg.appendChild(svgRect);
      var svgText = document.createElementNS('http://www.w3.org/2000/svg','text');
      var desc = this.getResponseHeader('x-server');
      // IE compatible
      var newText = document.createTextNode(desc);
      if(desc != null)
      svgText.appendChild(newText);
      
      svgText.setAttribute('x',width-40);
      svgText.setAttribute('y',height-5);
//      svgText.setAttribute('x','0');
//      svgText.setAttribute('y','0');      
      svgText.setAttribute('font-family','sans-serif');
      svgText.setAttribute('font-size','10px');
      svgText.setAttribute('fill','#000');
      svg.appendChild(svgText);      
//      img.src = imageUrl;

      // Get the description from S3 metadata

//      img.setAttribute('alt', desc);
//      img.alt = desc;      
      };
      xhr.send();
      }      
