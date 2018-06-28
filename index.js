var app = require('./app');
var aws = require('./aws')
var compareImage = require('./compareImage');
var imageManipulation = require('./imageManipulation');
const bodyParser = require("body-parser");
var fs = require('fs');



app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());


app.post('/', (req, res) => {
    var designImage = req.body.design;
    var markupImage = req.body.markup;
    var pathDesignImage, pathMarkupImage;
    var width = req.body.width;


    var pathDesignImagePromise = aws.downloadImage(designImage);
    pathDesignImagePromise.then((path) => {
       imageManipulation.imageResizeDesignImage(path,width).then((path)=>{
        pathDesignImage = path;
       
        var pathMarkupImagePromise = aws.downloadImage(markupImage);
        pathMarkupImagePromise.then((path) => {
           imageManipulation.imageResize(path,width).then((path)=>{
            pathMarkupImage = path;
            
            compareImage.compareImage(pathDesignImage,pathMarkupImage).then((data)=>{
                if(data.code==="same")
            {
                res.send({
                    code: "success",
                    meesage:"same"
                })
            }
            else{
                compareImage.getDiffPixelsCoords(pathDesignImage,pathMarkupImage).then((coordinate)=>{
                    compareImage.deleteFile(pathDesignImage);
                    compareImage.deleteFile(pathMarkupImage);
                    compareImage.getAveragePixelsCoords(coordinate).then((average)=>{
                        res.send({
                            code: "success",
                            message: "different",
                            coordinate: average
                        })
                    }).catch((error)=>{
                        console.log("ERROR WHEN CREAT AVERAGE"+error);
                        res.send({
                            code: "fail",
                            message: error
                        });
                    })
                    
                }).catch((error)=>{
                    console.log("ERROR WHEN CREAT COORDIDATE"+error);
                    res.send({
                        code: "fail",
                        message: error
                    });
                });
            }
            }).catch((error)=>{
                console.log("ERROR WHILE COMPARE: "+error);
                res.send({
                    code: "fail",
                    message: error
                });
            });
           }).catch((err)=>{
            console.log("ERROR WHEN RESIZE MARKUP IMAGE: "+err);
            res.send({
                code: "fail",
                message: error
            });
           });
        }).catch((error) => {
            console.log("ERROR GET PATH MARKUP IMAGE: "+error);
            res.send({
                code: "fail",
                message: error
            });
        });
       }).catch((err)=>{
            console.log("ERROR WHEN RESZIE DESING IMAGE: "+err);
            res.send({
                code: "fail",
                message: error
            });
       });
    }).catch((error) => {
        console.log("ERROR GET PATH DESIGN IMAGE: "+error);
        res.send({
            code: "fail",
            message: error
        });
    });


});

app.listen(3000);