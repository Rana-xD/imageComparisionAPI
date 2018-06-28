var randomstring = require("randomstring");
var Jimp = require("jimp");

module.exports.downloadImage = (url,width) => {
    return new Promise((resolve, reject) => {
        var path = "images/"+randomstring.generate(5)+".png";
        Jimp.read(url, function (err, image) {
     if(err)
     reject (err)

     image.resize(width,Jimp.AUTO).write(path,function(){
        resolve(path)
     });
     
});

    });
}

