const express = require('express');
const router = express.Router();
const { Genre, validate } = require('../models/genre');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');
const asyncMiddleware = require('../middlewares/asyncErrorMiddleware');

router.get('/', asyncMiddleware(async(req, res) => {

    const genres = await Genre.find().sort('name');
    res.send(
      {
        success: true,
        result: genres,
        message: "generes get"
      }
    ).status(200);
 
}));

router.post('/', auth, asyncMiddleware(async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(
      {
        success: false,
        error: error.details[0].message,
        message: "failed to add"
      }
    );
  }
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.status(200).send({
    success: true,
    result: genre,
    message: "record added successfully in genre model"
  });
}));

router.put('/:id', auth, asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({
        success: false,
        error: error.details[0].message,
        message: "failed to update"
      });
    }

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
      new: true
    });

    if (!genre) {
      return res.status(404).send({
        success: false,
        error: 'The genre with the given ID was not found.',
        message: 'failed to update'
      });
    }

    res.status(200).send(
      {
        success: true,
        result: genre,
        message: "record successfully updated"
      });
}));

router.delete('/:id', [auth, isAdmin], asyncMiddleware(async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) {
    return res.status(404).send(
      {
        success: false,
        error: 'The genre with the given ID was not found.',
        message: 'document not deleted'
      });
  }

  res.send({
    success: true,
    result: genre,
    message: 'document deleted successfully!'
  });
}));

router.get('/:id', asyncMiddleware(async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
}));

module.exports = router;