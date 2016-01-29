var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../models/user');
var Nominee = require('../models/nominee');

module.exports = {
  index: (req, res, next) => {
    Nominee.find({})
      .populate({
        path: 'voters',
        select: '_id facebook.name facebook.photo'
      })
      .then(nominees => res.status(200).json(nominees))
      .catch(next);
  },

  create: (req, res, next) => {
    var newNominee = new Nominee();
    newNominee.name = req.body.name;
    newNominee.save()
      .then(() => res.status(201).json(newNominee))
      .catch(next);
  },

  vote: (req, res, next) => {
    req.user.votes.push(req.params.id);
    req.user.save().then(() => {
      Nominee.findOne({ _id: req.params.id }).then(nominee => {
        nominee.voters.push(req.user._id);
        nominee.save().then(() => res.status(200).json({}));
      });
    })
    .catch(next);
  },

  removeVote: (req, res, next) => {
    req.user.votes.remove(ObjectId(req.params.id));
    req.user.save().then(() => {
      Nominee.findOne({ _id: req.params.id }).then(nominee => {
        nominee.voters.remove(ObjectId(req.user._id));
        nominee.save().then(() => res.status(202).json({}));
      });
    })
    .catch(next);
  },

  resetVoters: (req, res, next) => {
    Nominee.find({}).then(nominees => {
      Promise.all(nominees.map(nominee => {
        nominee.voters = [];
        return nominee.save();
      })).then(() => User.find({}).then(users => {
        Promise.all(users.map(user => {
          user.votes = [];
          return user.save();
        })).then(() => res.status(202).json({}));
      }));
    })
    .catch(next);
  },

  delete: (req, res, next) => {
    Nominee.remove({ _id: req.params.id }).then(() => {
      User.find({ votes: req.params.id }).then(users => {
        Promise.all(users.map(user => {
          user.votes.remove(ObjectId(req.params.id));
          return user.save();
        })).then(() => res.status(202).json({}));
      });
    })
    .catch(next);
  }
};
