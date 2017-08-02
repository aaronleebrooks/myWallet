exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://localhost/myWallet';

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ||
                      		'mongodb://localhost/test-node-capstone';


exports.PORT = process.env.PORT || 8080;