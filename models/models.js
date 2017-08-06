const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const WalletSchema = mongoose.Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  url: {type: String},
  image: {type: String}
});

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  wallet: [WalletSchema]
});

UserSchema.methods.removeCard = function(id) {
  let user = this;

  return user.update({
    $pull: {
      wallet: {
        _id: id
      }
    }
  });
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const User = mongoose.model('User', UserSchema, 'users');
const Wallet = mongoose.model('Wallet', WalletSchema);

module.exports = {User, Wallet};