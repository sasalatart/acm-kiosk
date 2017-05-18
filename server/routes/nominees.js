const router = require('express').Router();
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');
const Nominee = require('../models/nominee');

const index = (req, res, next) => {
  Nominee.find({}).populate({
    path: 'voters',
    select: '_id facebook.name facebook.photo'
  }).then(nominees => res.status(200).json({
    nominees,
    myVotes: req.user.votes
  })).catch(next);
};

const create = (req, res, next) => {
  const { name } = req.body;
  const newNominee = new Nominee({ name });
  newNominee.save()
    .then(() => res.status(201)
    .json(newNominee))
    .catch(next);
};

const vote = (req, res, next) => {
  const { user } = req;
  Nominee.findOneAndUpdate({ _id: req.params.id }, { $push: { 'voters': user._id } }, { new: true }).then(nominee => {
    return user.update({ $push: { 'votes': nominee._id } }).then(user => {
      res.status(200).json({ myVotes: user.votes, nominee })
    });
  }).catch(next);
};

const removeVote = (req, res, next) => {
  const { user } = req;
  Nominee.findOneAndUpdate({ _id: req.params.id }, { $pull: { 'voters': user._id } }, { new: true }).then(nominee => {
    return user.update({ $pull: { 'votes': nominee._id } }).then(user => {
      res.status(202).json({ myVotes: user.votes, nominee });
    });
  }).catch(next);
};

const resetVoters = (req, res, next) => {
  Nominee.update({}, { $set: { 'voters': [] } }, { multi: true }).then(() => {
    User.update({}, { $set: { 'votes': [] } }, { multi: true }).then(() => {
      res.status(202).json({});
    });
  }).catch(next);
};

const destroy = (req, res, next) => {
  Nominee.remove({ _id: req.params.id }).then(() => {
    User.update({}, { $pull: { 'votes': req.params.id } }, { multi: true }).then(() => {
      res.status(202).json({});
    });
  }).catch(next);;
};

module.exports = ({ isAuth }) => {
  router.get('/', isAuth, index);
  router.post('/', isAuth, create);
  router.put('/:id/vote', isAuth, vote);
  router.put('/:id/remove_vote', isAuth, removeVote);
  router.get('/reset_voters', isAuth, resetVoters);
  router.delete('/:id', isAuth, destroy);
  return router;
};
