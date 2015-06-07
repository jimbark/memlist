// handler for main page routes

// imports; fortune module provided as sample
var fortune = require('../lib/fortune.js');

// export one function for each route

exports.home = function(req, res){
        res.render('home');
};

exports.about = function(req, res){
        res.render('about', {
                fortune: fortune.getFortune(),
                pageTestScript: '/qa/tests-about.js'
        } );
};


