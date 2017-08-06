# myWallet

##App description:

If you're like me, sometimes you lose your wallet and everyhing you love within it. It's a huge hassle to try and figure out what you had in there, what things you are missing, how to replace it all. myWallet is a simple tool to help you remember what was in your wallet, and helps you replace those items at the click of a mouse.

Users can create their own account to store their 'wallet.' Once inside the site, they can add whatever items to their wallet as they want. They have the option to upload a picture of the object or card in their wallet, as well as update the items in case anything changes. This site uses a simple REST api to store and update the wallet collections, within the user's data.

##Development Roadmap:

Moving forward, I would like to implement higher security and encryption on the wallet page, so that users could feel comfortable holding more secure information, such as credit card or Driver's License numbers. That will add increased functionality to the website because then you could really replace your items at the click of a mouse.

##Screenshots

signup page login page profile page

##Documentation

###Users

GET '/me' - This route authenticates the user and checks the username and password by the Authorization headers. This API uses passport for basic authentication of usernames and passwords.

POST '/users' - This route adds an additional user to the site. This API uses passport for basic authentication of usernames and passwords.

###Wallet

GET 'users/wallet/:id' - This route gets the entire user's data, and can be used to view all of the items in a user's wallet array.

POST 'users/wallet/:id' - This route posts a new item to the user's wallet array. This route looks at the request body, not the parameters, to post the data. The ID parameter is to find the user, not the wallet item. This route requires the keys 'name' and 'description.' 'url' and 'image' are not required, but encouraged.

PUT 'users/wallet/:id' - This route updates an existing item in the user's wallet array. This route looks at the request body, not the parameters, to post the data. The ID parameter is to find the user, not the wallet item. This route requires the keys 'id', 'name', and 'description.' 'url' and 'image' are not required, but encouraged.

DELETE 'users/wallet/:id' - This route deletes an existing item in the user's wallet array. This route looks at the request body, not the parameters, to post the data. The ID parameter is to find the user, not the wallet item. This route just requires the 'id' key for the wallet item.

##Technologies Used

HTML/CSS/Javascript
Node.js/Mongo/Mongoose
Heroku/TravisCI
Lodash
Passport
Body-Parser
Express
Faker/Mocha/Chai
UploadCare