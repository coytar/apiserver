var express = require('express');
var router = express.Router();

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ users: [{ "name": "Fred" }, { "name": "Daphe" }] }).write();

router.get('/', (req, res) => {
  if (Object.keys(req.query).length > 0) {
    const keys = Object.keys(req.query);
    const key = keys[0];
    const value = req.query[key];
    console.log(key, value);
    return res.send(db.get("users").filter(x => x[key] == value));
  }
  return res.send(db.get("users").value());
});

router.get('/:userId', (req, res) => {
  return res.send(db.get("users").find({ name: req.params.userId }).value());
});

router.get('/:userId/:prop', (req, res) => {
  var value = db.get("users").find({ name: req.params.userId }).value();
  return res.send(value[`${req.params.prop}`]);
});

router.post('/:userId', (req, res) => {
  return res.status(405).send("");
});

router.put('/:userId', (req, res) => {
  const keys = Object.keys(req.body);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = req.body[key];
    db.get("users").find({ name: req.params.userId }).assign({ [key]: value }).write();
  }
  return res.send("OK");
});

router.delete('/:userId', (req, res) => {
  return res.status(405).send("");
});

module.exports = router;
