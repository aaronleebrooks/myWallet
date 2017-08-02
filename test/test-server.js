var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
const mongoose = require('mongoose');
const faker = require('faker');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);

const {User, Wallet} = require('../users/models');
const {runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

function seedUserData(){
  console.info('seeding list data');
  const seedData = [];

  for (let i=1; i<=10; i++) {
    seedData.push(generateUserData());
  }
  return User.insertMany(seedData);
}

function generateUserData() {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    wallet: [{
    	name: faker.lorem.words(),
    	description: faker.lorem.sentences(),
    	url: faker.internet.url(),
    	image: faker.image.imageUrl()
    }]   
  }
}

function tearDownDb(){
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}


describe('index page', function() {
  it('exists', function(done) {
    chai.request(app)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.html;
        done();
    });
  });
});


describe('Profile', function(){

	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedUserData();
	})

	after(function(){
		return closeServer();
	});

	afterEach(function() {
		return tearDownDb();
	});

	describe('GET ENDPOINT', function() {
		it('should return all existing posts', function() {
			let res;
			return chai.request(app)
				.get('/users/')
				.then(function(_res){
					res = _res;
					res.should.have.status(200);
					res.body.to.have.length.of.at.least(1);
					return User.count();
				})
				.then(function(count){
					res.body.should.have.length.of(count);
				});
		});

		it('should return posts with the right fields', function(){
			let resWallets;
			return chai.request(app)
				.get('/users/')
				.then(function(res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');
					res.body.to.have.length.of.at.least(1);

					res.body.forEach(function(user){
						user.should.be.a('object');
						user.should.include.keys(
							'username', 'wallet', 'id');
					});
					resWallets = res.body[0];
					return User.findById(resWallets.id).exec();
				})
				.then(function(users){
					resWallets.id.should.equal(users.id);
					resWallets.username.should.equal(users.username);
					resWallets.wallet.should.equal(users.wallet);
				});
		});
});

	describe('POST ENDPOINT', function() {
		it('should add a new user', function() {
			const newPost = {
						    username: faker.internet.userName(),
						    password: faker.internet.password(),
						    wallet: []   
							}

			const newWallet = {
					    	name: faker.lorem.words(),
					    	description: faker.lorem.sentences(),
					    	url: faker.internet.url(),
					    	image: faker.image.imageUrl()
							}


			return chai.request(app)
				.post('/users')
				.send(newPost)
				.then(function(res){
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys(
						'username', 'wallet', 'id');
					res.body.id.should.not.be.null;
					res.body.username.should.equal(newPost.username);
					res.body.wallet.should.equal(newPost.wallet);
					return User.findById(res.body.id);
				})
				.then(function(post){
					post.id.should.not.be.null;
					post.title.should.equal(newPost.title);
					post.author.firstName.should.equal(newPost.author.firstName);
					post.author.lastName.should.equal(newPost.author.lastName);
					post.content.should.equal(newPost.content);
				}).then(function(res){
					return chai.request(app)
					.post('/users/dashboard/'+res.id)
					.send(newWallet)
					.then(function(res){
						res.should.be.json;
						res.body.should.be.a('object');
						res.body.should.include.keys(
							'username', 'wallet', 'id');
						res.body.id.should.not.be.null;
						res.body.username.should.equal(newPost.username);
						res.body.wallet.should.equal(newPost.wallet);
						return User.findById(res.body.id);
					})
					.then(function(post){
						post.id.should.not.be.null;
						post.title.should.equal(newPost.title);
						post.author.firstName.should.equal(newPost.author.firstName);
						post.author.lastName.should.equal(newPost.author.lastName);
						post.content.should.equal(newPost.content);
					})
				})
		});
});

	describe('PUT ENDPOINT', function() {

		it('should update the fields you send over', function() {
			const updatedData = {
				name: 'Gone With The Wind',
				description: 'Someone else'
			};

			return User
				.findOne()
				.exec()
				.then(function(user) {
					updatedData.id = user.id;
					return chai.request(app)
						.put(`/users/${user.id}`)
						.send(updatedData);
				})
				.then(function(res) {
					res.should.have.status(201);

					return User.findById(updatedData.id).exec();
				})
				then(function(user) {
					user.name.should.equal(updatedData.name);
					user.description.should.equal(updatedData.description);
				});
		});
	});

	describe('DELETE ENDPOINT', function() {

		it('should delete a post', function() {

			let user;

			return User
				.findOne()
				.exec()
				.then(function(_user) {
					user = _user;
					return chai.request(app).delete(`/users/${user.id}`);
				})
				.then(function(res) {
					res.should.have.status(204);
					return User.findById(user.id);
				})
				.then(function(_user){
					should.not.exist(_post);
				});
		});
	});
});