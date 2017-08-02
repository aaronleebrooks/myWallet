exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://demo:demo@ds129053.mlab.com:29053/mywallet';

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      		'mongodb://demo:demo@ds129053.mlab.com:29053/mywallet';


exports.PORT = process.env.PORT || 8080;