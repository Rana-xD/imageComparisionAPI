var app = require('./app');
var aws = require('./aws')
var compareImage = require('./compareImage');
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


    var pathDesignImagePromise = aws.downloadImage(designImage);
    pathDesignImagePromise.then((path) => {
        pathDesignImage = path;
        
        var pathMarkupImagePromise = aws.downloadImage(markupImage);
        pathMarkupImagePromise.then((path) => {
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
                compareImage.createDiffImage(pathDesignImage,pathMarkupImage).then((diffPath)=>{
                    aws.uploadImage(diffPath).then((data)=>{
                        compareImage.deleteFile(pathDesignImage);
                        compareImage.deleteFile(pathMarkupImage);
                        console.log(data.Location);
                        res.send({
                            code: "success",
                            message: "different",
                            path: data.Location
                        })
                    }).catch((error)=>{
                        console.log("ERROR WHEN UPLOAD FILE"+error);
                        res.send({
                            code: "fail",
                            message: error
                        });    
                    });
                }).catch((error)=>{
                    console.log("ERROR WHEN CREAT DIFF FILE"+error);
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
        }).catch((error) => {
            console.log("ERROR GET PATH MARKUP IMAGE");
            res.send({
                code: "fail",
                message: error
            });
        });
    }).catch((error) => {
        console.log("ERROR GET PATH DESIGN IMAGE");
        res.send({
            code: "fail",
            message: error
        });
    });


});

app.listen(3000);