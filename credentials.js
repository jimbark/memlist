<<<<<<< HEAD
// Credentials module: stores all credentials in one central place for easy maintenance
// also allows this module to be excluded from GIT (.gitignore) so passwords etc not stroed on github

=======
>>>>>>> development
module.exports = {
    cookieSecret: 'headed plant offer riding',

    gmail: {
	    user: 'jimbark007@gmail.com',
	    password: 'jbgoogle007',
    },

<<<<<<< HEAD
    // Mongolab credentials
    mongo: {
	// development database
	development: {
            connectionString: 'mongodb://jimbark:jbmongo007@ds041432.mongolab.com:41432/meadowlark-dev',
	},
	// production database
=======
    mongo: {
	development: {
            connectionString: 'mongodb://jimbark:jbmongo007@ds041432.mongolab.com:41432/meadowlark-dev',
	},
>>>>>>> development
	production: {
            connectionString: 'mongodb://jimbark:jbmongo007@ds043012.mongolab.com:43012/meadowlark',
	},
    },

};

