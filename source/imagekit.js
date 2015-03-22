/*
imagekit.js
*/

//imagekit_main_object

var imagekit = {};
$i = imagekit;



//要素を渡したら、getImageDataでアクセス
imagekit.getImageData = function($el){

    //Create temporary elements.
    var tmp = {
      "base" : document.createElement('canvas')
    }

    //Get context
    var ctx = tmp.base.getContext('2d');

    //Set width and heights to temporary Canvas elements.
    tmp.base.width = $el.width;
    tmp.base.height = $el.height;

    //Set image to temporary canvas.
    ctx.drawImage($el,0,0);

    return ctx.getImageData(0,0,tmp.base.width,tmp.base.height);

  }



/*

mode:
  - grayscale
  - linear

*/
imagekit.convertToAlpha = function($el,mode,fillcolor){

  //Preprocess : getImageData from $el argment.
  var source = imagekit.getImageData($el);

  var tmp = document.createElement('canvas');
      tmp.width = source.width;
      tmp.height = source.height;

  var ctx = tmp.getContext('2d');
  var ctxData = ctx.getImageData(0,0,source.width,source.height);
  var rgba = ctxData.data;

  if (!fillcolor){
    fillcolor = [0,0,0]
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

  ctx.putImageData(ctxData,0,0);

  $("body").append(tmp);

  return source;
}

imagekit.applyAlpha = function(source,alpha,callback){

  }
