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
imagekit.convertToAlpha = function($el,mode){
  

}

imagekit.applyAlpha = function(source,alpha,callback){

  }
