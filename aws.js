var randomstring = require("randomstring");
var AWS = require('aws-sdk');
var fs = require('fs');
var s3 = new AWS.S3({
    accessKeyId: "AKIAJQ555LLLRGA7HSBA", //required
    secretAccessKey: "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" //required
});
module.exports.downloadImage = (url) => {
    return new Promise((resolve, reject) => {
        var keyfile = url.substring(49);
        var filename = keyfile.substring(keyfile.indexOf("/") + 1);  
        var path = 'images/' + filename;
        var params = {
            Bucket: "pu-ai-bc", //required
            Key: keyfile //required
        };
        s3.getObject(params, function (err, data) {
            if (err) {
                console.log(err.code, "-", err.message);
                reject(err);
            }
            fs.writeFile(path, data.Body, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(path);
                }
            });
        });
    });
}

module.exports.uploadImage = (diffPath) => {
    return new Promise((resolve,reject)=>{
        fs.readFile(diffPath, function (err, data) {
            if (err) throw err; // Something went wrong!
                
                var fileName = diffPath.substring(5);
                var params = {
                    Bucket:"pu-ai-bc",
                    Key: "diff/"+ fileName, //file.name doesn't exist as a property
                    Body: data,
                    ACL: 'public-read',
                };
                s3.upload(params, function (err, data) {
                    
                    // Whether there is an error or not, delete the temp file
                    
    
                
                    if (err) {
                        console.log('ERROR MSG: ', err);
                        reject(err);
                    } else {
                        fs.unlink(diffPath, function (err) {
                            if (err) {
                                console.log(err);
                            }
                            console.log('Temp File Delete');
                        });
                        resolve(data);
                    }
                });
            });
    
    });
    

}