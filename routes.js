// Routes to be imported by main application file
// these then call handlers

// import all handlers
var main = require('./handlers/main.js');
var tests = require('./handlers/tests.js');

module.exports = function(app){

    app.get('/', main.home);
    app.get('/about', main.about);
    app.get('/list-local', main.listLocal);
    app.get('/list-local-ajax', main.listLocalAjax);
    app.post('/listload', main.listLoad);


    app.get('/jquery-test', tests.jqueryTest);
    app.get('/headers', tests.headers);
    app.post('/cart/checkout', tests.cartCheckout);
    // next one commented out to avoid crashing site when crawled by Google etc
    // only un-comment this to allow testing of domain failures
    //app.get('/epic-fail', tests.epicFail);


};
