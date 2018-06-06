var looksSame = require('looks-same');
var randomstring = require("randomstring");
var fs = require('fs');
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

module.exports.createDiffImage = (desing, markup) => {
    return new Promise((resolve, reject) => {
        var randomString = randomstring.generate(6);
        var diffPath = 'diff/' + randomString + '.png';
        looksSame.createDiff({
            reference: desing,
            current: markup,
            diff: diffPath,
            highlightColor: '#ff00ff', //color to highlight the differences
            strict: true
        }, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve(diffPath);
            }
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