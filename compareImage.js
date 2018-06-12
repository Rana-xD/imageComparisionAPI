var looksSame = require('looks-same');
var randomstring = require("randomstring");
var fs = require('fs');
const utils = require('looks-same/lib/utils');

const readPair = utils.readPair;
const getDiffPixelsCoords = utils.getDiffPixelsCoords;
const areColorsSame = require('looks-same/lib/same-colors');

module.exports.compareImage = (desing, markup) => {
    return new Promise((resolve,reject) =>{
        looksSame(desing, markup, {
            strict: true
        }, function (error, equal) {
            var data = {
                code: "same"
            }
            if(error)
            {
                reject(error);
            }
            resolve (data);
        });
    
        var data = {
            code: "different"
        }
        resolve (data);
    });
    
}

module.exports.getDiffPixelsCoords = (desing, markup) => {
    return new Promise((resolve, reject) => {
        readPair(desing, markup, (error, pair) => {
                if(error)
                reject(error);
                getDiffPixelsCoords(pair.first, pair.second, areColorsSame, (result) => {
                   resolve(result);
                });
            });
    });
}

module.exports.deleteFile = (path) =>{
    fs.unlink(path, function (err) {
        if (err) {
            console.log(err);
        }
    });
}