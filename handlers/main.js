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


exports.listLoad = function(req, res){

    if(req.xhr || req.accepts('json,html')==='json'){
        console.log('Valid POST request to load a list with listid = ' + req.body.listid);

	// create list objects to be referenced by listid
	var lists = {};

	var title1 = 'World population by country';
	var items1 = [
	    '1. China     1.35 billion',
	    '2. India     1.22 billion',
	    '3. USA     316 million',
	    '4. Indonesia     251 mllion',
	    '5. Brazil     201 million',
	    '6. Pakistan     193 million',
	    '7. Nigeria     174 miilion',
	    '8. Bangladesh     163 million'
	    ];
	lists.list1 = { title: title1, items: items1};

	var title2 = 'World population by cheese';
	var items2 = [
	    '1. Cheddar     1.35 billion',
	    '2. Edam     1.22 billion',
	    '3. Wensleydale     316 million',
	    ];
	lists.list2 = { title: title2, items: items2};

	// respond with the requested list object
        res.send({
	    success: true, 
	    message: 'List provided as json object: ' + req.body.listid,
	    list: JSON.stringify(lists[req.body.listid]),
	});
	
        // save the .cfg file in the files/ztpready directory
        //var cfgfile = 'public/files/ztpready/' + info.params.localswitchname + '.cfg';
        //fs.writeFile(cfgfile, info.conf, function (err) {
        //    if (err) {
        //        console.log('error saving file');
        //        throw err;
        //    } else {
        //        console.log("File named " + cfgfile + " saved!");
        //        res.send({success: true, message: 'List provided as json object: ' + req.body.listid});
        //    }
        //});
    } else {
        console.log('Invalid POST request to load a list via AJAX.');
        res.send({success: false, message: 'Webserver unable to provide list via AJAX; check Webserver log for further information.'});
    }

};



/*


// route to handle request to save config file to ZTP server
app.post('/listload', function(req, res){
    if(req.xhr || req.accepts('json,html')==='json' || req.body.buttonid==='ztpsave'){
        console.log('Valid POST request to configdisplay with buttonid = ' + req.body.buttonid);

        // save the .cfg file in the files/ztpready directory
        var cfgfile = 'public/files/ztpready/' + info.params.localswitchname + '.cfg';
        fs.writeFile(cfgfile, info.conf, function (err) {
            if (err) {
                console.log('error saving file');
                throw err;
            } else {
                console.log("File named " + cfgfile + " saved!");
                res.send({success: true, message: 'Config file successfully saved to ZTP server!'});
            }
        });
    } else {
        console.log('Invalid POST request to configdisplay.');
        res.send({success: false, message: 'Webserver unable to save file on ZTP server; check Webserver log for further information.'});
    }
});

*/

