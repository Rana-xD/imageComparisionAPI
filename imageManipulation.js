var Jimp = require("jimp");
var fs = require('fs');
var randomstring = require("randomstring");
var compareImage = require('./compareImage');
module.exports.imageResize = (path,width) => {
    return new Promise((resolve,reject)=>{
        Jimp.read(path).then(function(image){
                image.resize(width,Jimp.AUTO)
                     .write(path);
                resolve(path);
            
        }).catch((err)=>{
            reject(err);
        });
    });
}

module.exports.imageResizeDesignImage = (path,width) =>{
    return new Promise((resolve,reject)=>{
        var newPath = "images/"+randomstring.generate(5)+".png";
       
        Jimp.read(path).then(function(image){
                image.resize(width,Jimp.AUTO)
                     .write(newPath);
                     resolve(newPath);
                     compareImage.deleteFile(path);
        }).catch((err)=>{
            reject(err);
        });
  
       
    });
}