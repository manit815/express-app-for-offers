const INGCategories = require('../models/categories.model.js');

exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Category content can not be empty"
        });
    }

    // if(err){
    //     return res.send({
    //         message: 'request body'+req.body.content
    //     })
    // }
    // Create a Category
    const category = new INGCategories({
        categoryId: req.body.categoryId,
        categoryName: req.body.categoryName,
        description: req.body.description,
        details: req.body.details
    });

    // Save Category in the database
    category.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Category."
            });
        });
};

exports.findAll = (req, res) => {
    console.log('request', req);
    INGCategories.find()
        .then(categories => {
            res.send(categories);
            var message = {
                app_id: "dc7c27bc-c603-4baa-a382-26feb9ca6e03",
                contents: { categories },
                included_segments: ["All"]
            };
            sendNotification(message);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving categories."
            });
        });
};

exports.findOne = (req, res) => {
    console.log(req.params);

    var categoriesArray = ['food', 'fashion', 'movies', 'electronics'];

    // if (categoriesArray.indexOf(req.params.categoryId) >= 0) {
    //     INGCategories.findBy(req.params.categoryId)
    //         .then(category => {
    //             if (!category) {
    //                 return res.status(404).send({
    //                     message: "Category not found with id " + req.params.categoryId
    //                 });
    //             }
    //             res.send(category);
    //         }).catch(err => {
    //             if (err.kind === 'ObjectId') {
    //                 return res.status(404).send({
    //                     message: "Category not found with id " + req.params.categoryId
    //                 });
    //             }
    //             return res.status(500).send({
    //                 message: "Error retrieving category with id " + req.params.categoryId
    //             });
    //         });
    // }

    INGCategories.findById(req.params.categoryId)
        .then(category => {
            if (!category) {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            res.send(category);
            var message = {
                app_id: "dc7c27bc-c603-4baa-a382-26feb9ca6e03",
                contents: { categories },
                included_segments: ["All"]
            };
            sendNotification(message);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.categoryId
                });
            }
            return res.status(500).send({
                message: "Error retrieving category with id " + req.params.categoryId
            });
        });
};

exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "category content can not be empty"
        });
    }

    // Find category and update it with the request body
    INGCategories.findByIdAndUpdate(req.params.categoryId, {
        categoryId: req.body.categoryId,
        categoryName: req.body.categoryName,
        categoryImage: req.body.categoryImage,
        description: req.body.description
    }, { new: true })
        .then(category => {
            if (!category) {
                return res.status(404).send({
                    message: "category not found with id " + req.params.categoryId
                });
            }
            res.send(category);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "category not found with id " + req.params.categoryId
                });
            }
            return res.status(500).send({
                message: "Error updating category with id " + req.params.categoryId
            });
        });
};

exports.delete = (req, res) => {
    INGCategories.findByIdAndRemove(req.params.categoryId)
        .then(category => {
            if (!category) {
                return res.status(404).send({
                    message: "category not found with id " + req.params.categoryId
                });
            }
            res.send({ message: "category deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "category not found with id " + req.params.categoryId
                });
            }
            return res.status(500).send({
                message: "Could not delete category with id " + req.params.categoryId
            });
        });
};


exports.behavior = (req, res) => {
    console.log('inside behavior', req.params)
    INGCategories.count(req.params)
        .then(category => {
            res.send({message: category});
        }).catch(err => {
            res.send({message: 'not able to get the count'})
        })
}


var sendNotification = function (data) {
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic NmY2ZDNkMjAtMWE5Mi00ZGU1LThiZmQtMjUwMWRjNjM3MzUx"
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    var https = require('https');
    var req = https.request(options, function (res) {
        res.on('data', function (data) {
            console.log("Response:");
            console.log(JSON.parse(data));
        });
    });

    req.on('error', function (e) {
        console.log("ERROR:");
        console.log(e);
    });

    req.write(JSON.stringify(data));
    req.end();
};