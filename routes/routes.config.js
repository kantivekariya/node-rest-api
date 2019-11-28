exports.routesConfig = (router) => {
    const user = require('../controllers/user.controller');

    // Create
    router.post('/register', user.register);

    // Login 
    router.post('/login', user.login);

    // GetAll Data
    router.get('/users', user.findAll);

    // Get, Delete and Update by ID
    router.route('/users/:userId')
        .get(user.findOne)
        .put(user.update)
        .delete(user.delete);
}