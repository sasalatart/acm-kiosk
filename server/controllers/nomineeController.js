var async = require('async');
var ObjectId = require('mongoose').Types.ObjectId;
var Nominee = require('../models/nominee');
var User = require('../models/user');

module.exports = {
  index: function(req, res) {
    Nominee.find({}, function(err, nominees) {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json(nominees);
      }
    });
  },

  create: function(req, res) {
    var newNominee = new Nominee();
    newNominee.name = req.body.name;

    newNominee.save(function(err) {
      if (err) {
        res.status(400).json({ messages: 'Failed to create your new product.' });
      } else {
        res.status(201).json(newNominee);
      }
    });
  },

  vote: function(req, res) {
    req.user.votes.push(req.params.id);
    req.user.save(function(err) {
      if (err) {
        res.status(400).json({ messages: err });
      } else {
        Nominee.findOne({ _id: req.params.id }, function(err, nominee) {
          if (err) {
            res.status(400).json({ messages: err });
          } else {
            nominee.voters.push(req.user._id);
            nominee.save(function(err) {
              if (err) {
                res.status(400).json({ messages: err });
              } else {
                res.status(200).json(nominee);
              }
            });
          }
        });
      }
    });
  },

  removeVote: function(req, res) {
    req.user.votes.remove(ObjectId(req.params.id));
    req.user.save(function(err) {
      if (err) {
        res.status(400).json({ messages: err });
      } else {
        Nominee.findOne({ _id: req.params.id }, function(err, nominee) {
          if (err) {
            res.status(400).json({ messages: err });
          } else {
            nominee.voters.remove(ObjectId(req.user._id));
            nominee.save(function(err) {
              if (err) {
                res.status(400).json({ messages: err })
              } else {
                res.status(202).json({});
              }
            })
          }
        })
      }
    })
  },

  getVoters: function(req, res) {
    User.find({ votes: req.params.id }, function(err, users) {
      if (err) {
        res.status(500).json({ messages: 'Failed to get the voters.' });
      } else {
        res.status(200).json(users);
      }
    })
  },

  delete: function(req, res) {
    Nominee.remove({ _id: req.params.id }, function(err) {
      if (err) {
        res.status(500).json({ messages: 'Failed to remove your nominee.' });
      } else {
        User.find({ votes: req.params.id }, function(err, users) {
          if (err) {
            res.status(500).json({ messages: 'Failed to remove your nominee.' });
          } else {
            if (users.length === 0) {
              res.status(202).json({});
            } else {
              async.each(users, function(user) {
                user.votes.remove(ObjectId(req.params.id));
                user.save();
              }, res.status(202).json({}));
            }
          }
        });
      }
    });
  }
}
