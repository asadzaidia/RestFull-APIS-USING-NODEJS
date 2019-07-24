const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const Genre = mongoose.model('Genre', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  }
}));

router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find().sort('name');
    res.send(
      {
        success: true,
        result: genres,
        message: "generes get"
      }
    ).status(200);
  }
  catch (ex) {
    console.log(ex);
  }
});

router.post('/', async (req, res) => {
  const { error } = validateGenre(req.body);
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
});

router.put('/:id', async (req, res) => {
  try {
    const { error } = validateGenre(req.body);
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

  } catch (ex) {
    return res.status(500).send({
      success: false,
      error: 'Object id is not valid',
      message: 'failed to update'
    });
    // console.log(ex.message);
  }
});

router.delete('/:id', async (req, res) => {
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
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

module.exports = router;