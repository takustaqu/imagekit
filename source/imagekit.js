/*
imagekit.js
*/

//imagekit_main_object

var imagekit = {};
$i = imagekit;




/*

imagekit.getImageData

*/


imagekit.createCanvas = function(width,height){

    var tmp = {
        el : document.createElement('canvas')
      };

    if(!!width){
      tmp.el.width = parseInt(width);
    }

    if(!!height){
      tmp.el.height = parseInt(height);
    }

    tmp.ctx = tmp.el.getContext('2d');

    return tmp;

  }//imagekit.createCanvas;


imagekit.getImageData = function($el){

    //Create temporary elements.
    var tmp = imagekit.createCanvas($el.width,$el.height);

    //Set image to temporary canvas.
    tmp.ctx.drawImage($el,0,0);

    return tmp.ctx.getImageData(0,0,tmp.el.width,tmp.el.height);

  }//imagekit.getImageData;



/*

mode:
  - grayscale
  - linear

*/


imagekit.convertToAlpha = function($el,mode,fillcolor){

    //Preprocess : getImageData from $el argment.
    var source = imagekit.getImageData($el);

    //create temporary canvas element.

      // var tmp = document.createElement('canvas');
      //     tmp.width = source.width;
      //     tmp.height = source.height;
      //
      // //get context.
      // var ctx = tmp.getContext('2d');

    var tmp = imagekit.createCanvas(source.width,source.height)

    //make getImageData alias.
    var ctxData = tmp.ctx.getImageData(0,0,source.width,source.height);

    //make alias for temporary canvas's imagedata array.
    var rgba = ctxData.data;

    if (!fillcolor){
      fillcolor = [0,0,0];
    }

    //Grayscale Mode.
    if (!mode || mode == "grayscale"){

      //parse source data.
      var tmpCell = 0;
      for(var i=0,il=source.data.length;i<il;i++){

        //if this cell is alpha channel.

        if(i%4 == 3){
          //Calculate grayscale pixel average(RGB/3 and Math.floor())
          var pxlAvr = Math.floor(tmpCell/3);

          //Apply RGB Channel color from argment value.
          rgba[i-3] = fillcolor[0];
          rgba[i-2] = fillcolor[1];
          rgba[i-1] = fillcolor[2];

          //Apply Alpha channel value from average.
          rgba[i] = pxlAvr;

          //Reset temporary counter.
          tmpCell = 0;

        }else{

          //Add current value to tmpCell.
          tmpCell = tmpCell + source.data[i];
        }
      }

    }//endif;

    tmp.ctx.putImageData(ctxData,0,0);
    $el.src = tmp.el.toDataURL();

  }//imagekit.convertToAlpha



imagekit.applyAlphaToImageElement = function($src,$asrc,callback){

    //create temporary canvas.
    var tmp = imagekit.createCanvas($src.width,$src.height);

    var alphaimg = document.createElement('img');
    alphaimg.src = $asrc.src;

    imagekit.convertToAlpha(alphaimg);

    //Set image to temporary canvas.
    tmp.ctx.drawImage(alphaimg,0,0);
    tmp.ctx.globalCompositeOperation = 'source-in';
    tmp.ctx.drawImage($src,0,0);

    $src.src = tmp.el.toDataURL();

  }//imagekit.applyAlphaToImageElement;
