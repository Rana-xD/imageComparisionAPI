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
module.exports.getAveragePixelsCoords = (coordinate) => {
    return new Promise((resolve,reject) =>{
        var group = [];
      
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
var average = [];
var sumX = 0;
var sumY = 0;
var averageX = 0;
var averageY = 0;
var averageXY = [];
group.forEach((small) =>{
    small.forEach((mini) =>{
        sumX += mini[0];
        sumY += mini[1];
    });
    averageX = Math.round(sumX / small.length);
    averageY = Math.round(sumY / small.length);
    averageXY = [averageX,averageY];
    average.push(averageXY);
});
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