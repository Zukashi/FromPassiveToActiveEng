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
})
  .post('/', (req, res) => {
    const id = db.create(req.body);
    res.render('home/added', {
      id,
    });
  }).delete('/deleted/:id', (req, res) => {
    db.delete(req.params.id);
    res.render('home/deleted');
  });

module.exports = {
  homeRouter,
};
