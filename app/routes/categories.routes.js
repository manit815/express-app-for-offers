module.exports = (app) => {
    const categories = require('../controllers/categories.controller.js');
    // // console.log('inside routes');
    // /*create the categories*/
    app.post('/categories', categories.create);

    // /*get all the categories*/
    app.get('/categories', categories.findAll);

    app.get('/categories/:categoryId', categories.findOne);

    app.put('/categories/:categoryId', categories.update);

    app.delete('/categories/:categoryId', categories.delete);

    app.get('/categories/count/:categoryId', categories.behavior);
}