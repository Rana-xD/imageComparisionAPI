#!/usr/bin/env node
var app = require('./app');
var aws = require('./aws')
var compareImage = require('./compareImage');
const bodyParser = require("body-parser");
var fs = require('fs');



/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res, next) => {
    res.status(200);
    res.send({status:'OK', message:'Ready to rock.'});
});

app.post('/', (req, res) => {
    var designImage = req.body.design;
    var markupImage = req.body.markup;
    var pathDesignImage, pathMarkupImage;
    var width = req.body.width;
    width = parseInt(width);

    var pathDesignImagePromise = aws.downloadImage(designImage,width);
    pathDesignImagePromise.then((path) => {
        pathDesignImage = path;
        var pathMarkupImagePromise = aws.downloadImage(markupImage,width);
        pathMarkupImagePromise.then((path) => {
            pathMarkupImage = path;
            compareImage.compareImage(pathDesignImage,pathMarkupImage).then((data)=>{
                if(data.code==="same")
            {
                compareImage.deleteFile(pathDesignImage);
                compareImage.deleteFile(pathMarkupImage);
		res.status(200);
                res.send({
                    code: "success",
		    statusCode: 200,
                    meesage:"same"
                })
            }
            else{
                compareImage.getDiffPixelsCoords(pathDesignImage,pathMarkupImage).then((coordinate)=>{
                    compareImage.deleteFile(pathDesignImage);
                    compareImage.deleteFile(pathMarkupImage);
                    compareImage.getAveragePixelsCoords(coordinate).then((average)=>{
			res.status(200);
                        res.send({
                            code: "success",
			    statusCode: 200,
                            message: "different",
                            coordinate: average
                        })
                    },(error)=>{
                        console.log("ERROR WHEN CREAT AVERAGE"+error);
			res.status(500);
                        res.send({
                            code: "fail",
			    statusCode: 500,
                            message: error
                        });
                    }).catch((error)=>{
                        console.log("ERROR WHEN CREAT AVERAGE"+error);
			res.status(500);
                        res.send({
                            code: "fail",
			    statusCode: 500,
                            message: error
                        });
                    })
                    
                },(error)=>{
                    console.log("ERROR WHEN CREAT COORDIDATE"+error);
		    res.status(500);
                    res.send({
                        code: "fail",
			statusCode: 500,
                        message: error
                    });
                }).catch((error)=>{
                    console.log("ERROR WHEN CREAT COORDIDATE"+error);
		    res.status(500);
                    res.send({
                        code: "fail",
			statusCode: 500,
                        message: error
                    });
                });
            }
            },(error)=>{
                console.log("ERROR WHILE COMPARE: "+error);
		res.status(500);
                res.send({
                    code: "fail",
		    statusCode: 500,
                    message: error
                });
            }).catch((error)=>{
                console.log("ERROR WHILE COMPARE: "+error);
		res.status(500);
                res.send({
                    code: "fail",
		    statusCode: 500,
                    message: error
                });
            });
           },(error)=>{
            console.log("ERROR WHEN RESIZE MARKUP IMAGE: "+err);
	    res.status(500);
            res.send({
                code: "fail",
		statusCode: 500,
                message: error
            }); 
           }).catch((err)=>{
            console.log("ERROR WHEN RESIZE MARKUP IMAGE: "+err);
	    res.status(500);
            res.send({
                code: "fail",
		statusCode: 500,
                message: error
            });
           });
    }, (error) => {
        console.log("ERROR GET PATH DESIGN IMAGE: "+error);
	res.status(500);
        res.send({
            code: "fail",
	    statusCode: 500,
            message: error
        });
    }).catch((error) => {
        console.log("ERROR GET PATH DESIGN IMAGE: "+error);
	res.status(500);
        res.send({
            code: "fail",
	    statusCode: 500,
            message: error
        });
    });


});

app.listen(3000);
