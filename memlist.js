// TODO

// initialise git, and link to github
// create git branches and start proper development process

// add navigation header
// start work on one page memlist tool
// remove jquery load at top file (so need to remove jquery test handlebars view?)


var express = require('express');
var bodyParser  = require('body-parser');
var formidable = require('formidable');
var credentials = require('./credentials.js');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(expressSession);
var rest = require('connect-rest');

var app = express();

// set up handlebars view engine for use with main page views and email templates
var handlebars = require('express-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
	static: function(name) {
	    return require('./lib/static.js').map(name);
	},
    },
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

// setup MongoDB using Mongolabs service
// connection options
var opts = {
    server: {
       // prevent database connection errors for long-running applications
       socketOptions: { keepAlive: 1 }
    }
};
// make connection to database
switch(app.get('env')){
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, opts);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, opts);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}

// enter MongoDB seed data  NOTE: app-cluster means get two copies of each entry !!
// only un-comment this once ot gte data loaded
/* Vacation.find(function(err, vacations){
    if(vacations.length) return;

    new Vacation({
        name: 'Hood River Day Trip',
        slug: 'hood-river-day-trip',
        category: 'Day Trip',
        sku: 'HR199',
        description: 'Spend a day sailing on the Columbia and ' +
            'enjoying craft beers in Hood River!',
        priceInCents: 9995,
        tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
        inSeason: true,
        maximumGuests: 16,
        available: true,
        packagesSold: 0,
    }).save();

    new Vacation({
        name: 'Rock Climbing in Bend',
        slug: 'rock-climbing-in-bend',
        category: 'Adventure',
        sku: 'B99',
        description: 'Experience the thrill of climbing in the high desert.',
        priceInCents: 289995,
        tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing'],
        inSeason: true,
        requiresWaiver: true,
        maximumGuests: 4,
        available: false,
        packagesSold: 0,
        notes: 'The tour guide is currently recovering from a skiing accident.',
    }).save();
});
*/

// setup domains for resilience, to handle uncaught exceptions
app.use(function(req, res, next){
    // create a domain for this request
    var domain = require('domain').create();
    // handle errors on this domain
    domain.on('error', function(err){
        console.error('DOMAIN ERROR CAUGHT\n', err.stack);
        try {
            // failsafe shutdown in 5 seconds
            setTimeout(function(){
                console.error('Failsafe shutdown.');
                process.exit(1);
            }, 5000);

            // disconnect from the cluster (only relevant if running cluster, multiple cores)
            var worker = require('cluster').worker;
            if(worker) worker.disconnect();

            // stop taking new requests
            server.close();

            try {
                // attempt to use Express error route
                next(err);
            } catch(e){
                // if Express error route failed, try
                // plain Node response
                console.error('Express error mechanism failed.\n', e.stack);
                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain');
                res.end('Server error.');
            }
        } catch(e){
            console.error('Unable to send 500 response.\n', e.stack);
        }
    });

    // add the request and response objects to the domain
    domain.add(req);
    domain.add(res);

    // execute the rest of the request chain in the domain
    domain.run(next);

});

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(credentials.cookieSecret));

// use session store running against MongoDB
app.use(expressSession({
    secret: credentials.cookieSecret,
    resave: false,
    saveUninitialized: false,
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
}));

// Allow cross origin access, but to only the API routes
app.use('/api', require('cors')());

// if in dev mode and tests requested then enable display of test results
app.use(function(req, res, next){
        res.locals.showTests = app.get('env') !== 'production' &&
                req.query.test === '1';
        next();
});

// load any handlebars partials
app.use(function(req, res, next){
        if(!res.locals.partials) res.locals.partials = {};
        // exmaple of how to load partials object
        //res.locals.partials.weather = weather.getWeatherData();
        next();
});

// flash message display preparation
app.use(function(req, res, next){
        // if there's a flash message, transfer
        // it to the context, then clear it so at next request
        // re.locals.flash is also cleared
        res.locals.flash = req.session.flash;
        delete req.session.flash;
        next();
});

// load either morgan or express-logger depending on run environment
// by putting the require() in conditional we only load the one we need
switch(app.get('env')){
    case 'development':
        // compact, colorful dev logging
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        // module 'express-logger' supports daily log rotation
        app.use(require('express-logger')({
            path: __dirname + '/log/requests.log'
        }));
        break;
}

// logging to show which worker is handling this request
app.use(function(req,res,next){
    var cluster = require('cluster');
    if(cluster.isWorker) console.log('Worker %d received request',
        cluster.worker.id);
    next();
});

// import website routes
require('./routes.js')(app);

// import native Express API routes
require('./apiroutes.js')(app);

// import Connect-REST API routes
require('./apiRestRoutes.js')(rest);

// API configuration, including using a separate domain
var apiOptions = {
    context: '',
    domain: require('domain').create(),
};

// handle API domain errors
apiOptions.domain.on('error', function(err){
    console.log('API domain error.\n', err.stack);
    setTimeout(function(){
        console.log('Server shutting down after API domain error.');
        process.exit(1);
    }, 5000);
    server.close();
    var worker = require('cluster').worker;
    if(worker) worker.disconnect();
});

// link API into pipeline
app.use(rest.rester(apiOptions));

// custom 404 page
app.use(function(req, res, next){
        res.status(404);
        res.render('404');
});

// custom 500 page
app.use(function(err, req, res, next){
        console.error(err.stack);
        res.status(500);
        res.render('500');
});


function startServer(){
    http.createServer(app).listen(app.get('port'), function(){
	console.log( 'Express started in ' + app.get('env') + 
		' mode on http://localhost:' +
		app.get('port') + '; press Ctrl-C to terminate.' );
    });
}

if(require.main === module){
    // application run directly; start app server
    startServer();
} else {
    // application imported as a module via "require": export function
    // to create server
    module.exports = startServer;
}


