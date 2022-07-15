const express = require('express');
const { writeFile, unlink, readFile } = require('fs').promises;
const { join } = require('path');
const { db } = require('../utils/db');

const FULLPATH = join(__dirname, '../data', 'word.json');
const homeRouter = express.Router();
homeRouter.get('/', async (req, res) => {
  const sortedDb = db._sort();
  const indexedDb = db._assignID(sortedDb);
  await unlink(FULLPATH);
  await writeFile(FULLPATH, JSON.stringify(indexedDb), 'utf8');
  const freshDb = JSON.parse(await readFile(FULLPATH, 'utf8'));
  res.render('home/home', {
    freshDb,
  });
}).get('/form/add', (req, res) => {
  res.render('home/add');
}).get('/:id', (req, res) => {
  res.render('home/one.hbs', {
    obj: db.getOne(req.params.id),
  });
}).put('/:id', (req, res) => {
  const { id } = req.params;
  const update = db.update(req.params.id, req.body);
  res.render('home/modified.hbs', {
    name: req.body.name,
    update,
    id,
  });
})
  .get('/edit/:id', (req, res) => {
    res.render('home/edit.hbs', {
      obj: db.getOne(req.params.id),
    });
  })
  .post('/added', (req, res) => {
    const id = db.create(req.body);
    res.render('home/added', {
      id,
    });
  })
  .post('/added/sentence/:id', (req, res) => {
    const obj = db.getOne(req.params.id);
    obj.sentences.push(req.body.sentences);
    db._save();
    res.render('home/added/sentence', {
      obj,
    });
  })
  .get('/form/addSentence/:id', (req, res) => {
    // console.log(db.getOne(req.params.id));
    res.render('home/addSentence', {
      obj: db.getOne(req.params.id),
    });
  })
  .delete('/deleted/:id', (req, res) => {
    db.delete(req.params.id);
    res.render('home/deleted');
  });
module.exports = {
  homeRouter,
};
