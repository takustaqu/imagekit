/*
imagekit.js
*/

//imagekit_main_object

var imagekit = {};
$i = imagekit;


/*

imagekit.getImageData

*/



/**
 * createCanvas
 * @param {number} width - Element width.
 * @param {number} height - Element heights.
 * @return {object} - { el:canvas DOM Element , ctx:context('2d') }
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



/**
 * getImageData
 */

imagekit.getImageData = function($el){

    //Create temporary elements.
    var tmp = imagekit.createCanvas($el.width,$el.height);

    //Set image to temporary canvas.
    tmp.ctx.drawImage($el,0,0);

    return tmp.ctx.getImageData(0,0,tmp.el.width,tmp.el.height);

  }//imagekit.getImageData;



/**
 * convertToAlpha

 mode:
   - grayscale
   - linear

 */

imagekit.convertToAlpha = function($el,mode,fillcolor){

    //Preprocess : getImageData from $el argment.
    var source = imagekit.getImageData($el);

    //create temporary canvas element.
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


/**
 * applyAlphaToImageElement
*/

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


imagekit.MakeSprite = function($src){
    //create temporary canvas.
    this.$src = $src;
  }

imagekit.MakeSprite.prototype.getSprite = function(x,y,w,h){

    //Create temporary canvas in target cell sizes.
    var tmp = imagekit.createCanvas(w,h);

        //draw cell to canvas.
        tmp.ctx.drawImage(this.$src,x,y,w,h,0,0,w,h)

    //return result.
    return tmp.el.toDataURL();

  }

imagekit.isLoaded = function($elem,callback){

  var count = $elem.length;
  console.log(count);
  var loadCount = 0;

  var check = function(){
    if(count == loadCount ){
      console.log(count == loadCount , count , loadCount)
      callback();
      return true;
    }
  }

  $elem.each(function(){
    var $img = $("<img />").on({"load":function(){
        if ($img[0].width > 0){
          loadCount++;
          check();
        }else{
          setTimeout(function(){
            $img.trigger("load")
          },50)//retry after 50ms
        }
      }}).attr("src",$(this).attr("src"));
  })
}
