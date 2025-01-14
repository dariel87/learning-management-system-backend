var express = require('express');
var router = express.Router();

const usersRouter = require('./users');
const subjectsRouter = require('./subjects');
const yearsRouter = require('./academic_year');
const classesRouter = require('./kelas');

const api = router.use('/users', usersRouter)
.use('/subjects', subjectsRouter)
.use('/academic_years', yearsRouter)
.use('/classes', classesRouter)

module.exports = router.use('/api', api);