var Jimp = require("jimp");
var fs = require('fs');
module.exports.imageResize = (path,width,height) => {
    return new Promise((resolve,error)=>{
        Jimp.read(path).then(function(image){
                image.resize(width,height)
                     .write(path);
                resolve(path);
            
        }).catch((err)=>{
            reject(err);
        });
    });
}