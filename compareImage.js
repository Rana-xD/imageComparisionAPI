var looksSame = require('looks-same');
var randomstring = require("randomstring");
var fs = require('fs');
const utils = require('looks-same/lib/utils');
var Jimp = require("jimp");

const readPair = utils.readPair;
const getDiffPixelsCoords = utils.getDiffPixelsCoords;
const areColorsSame = require('looks-same/lib/same-colors');

module.exports.compareImage = (desing, markup) => {
    return new Promise((resolve,reject) =>{
        Jimp.read(desing, function (err, imageA) {
    if (err) 
    reject(err)
    Jimp.read(markup, function (err, imageB) {
        if (err) reject(err);
        var diff = Jimp.diff(imageA, imageB); // threshold ranges 0-1 (default: 0.1)
        if(diff.percent == 0)
        {
            data = {
                code : "same"
            }
            resolve(data);
        }
        else
        {
            data = {
                code : "different"
            }
            resolve(data);
        }

    });
});
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
module.exports.getAveragePixelsCoords = (coordinate) => {
    return new Promise((resolve,reject) =>{
        var group = [];
console.log(coordinate.length);  
while(coordinate.length)
{
    var smallGroup = [];
    var temp = [];
    coordinate.forEach((arr, index) => {
        if (smallGroup.length == 0) {
            smallGroup.push(arr);
            temp.push(index);
        }
        else{
            var resultX = Math.abs(smallGroup[0][0] - arr[0]);
            var resultY = Math.abs(smallGroup[0][1] - arr[1])
            if(resultX < 40 && resultY < 40)
            {
                smallGroup.push(arr);
                temp.push(index);
            }     
        }
    });
    for (var i = temp.length -1; i >= 0; i--)
    coordinate.splice(temp[i],1);

    group.push(smallGroup);
}
var average = []
group.forEach((small) =>{
    var mini = []
    miniX = getMiniX(small);
    miniY = getMiniY(small);
    mini.push(miniX);
    mini.push(miniY);
    average.push(mini);
});
// console.log(average.length);  
resolve(average);
    });
}



module.exports.deleteFile = (path) =>{
    fs.unlink(path, function (err) {
        if (err) {
            console.log(err);
        }
    });
}

function getMiniX(arr)
{
    var miniX = arr[0][0];
    arr.forEach((small)=>{
        if(small[0] < miniX)
        {
            miniX = small[0];
        }
       
    });

    return miniX;
}

function getMiniY(arr)
{
    var miniY = arr[0][1];
    arr.forEach((small)=>{
        if(small[1] < miniY)
        {
            miniY = small[1];
        }
       
    });

    return miniY;
}