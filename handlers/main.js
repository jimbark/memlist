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

exports.listLocal = function(req, res){
        res.render('list-local');
};

exports.listLocalAjax = function(req, res){
        res.render('list-local-ajax');
};


