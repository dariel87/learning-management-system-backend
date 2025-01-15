var express = require('express');
var router = express.Router();
const { Subject } = require("../models");

/**
 * LIST RECORDS
 */
router.get('/', async (req, res) => {
    const subjects = await Subject.findAll();

    res.send(subjects);
});

/**
 * CREATE RECORD
 */
router.post('/', async (req, res) => {
    const { name } = req.body;

    try {
        await Subject.create({
            name
        });

        res.send({
            error: 0,
            message: 'Subject created successfully'
        })
    } catch (e) {
        res.status(500).send({
            error: 1,
            message: 'Failed creating subject.'
        });
    }
})

/**
 * GET RECORD DETAIL
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try { 
        const subject = await Subject.findByPk(id);
        
        if(subject === null){
            throw new Error('Subject not found');
        }

        res.send(subject)
    } catch(e) {
        res.status(404).send({
            error: 1,
            message: 'Subject not found.'
        })
    }
})

/**
 * UPDATE RECORD
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try { 
        const subject = await Subject.findByPk(id);

        if(subject === null){
            throw new Error('Subject not found');
        }

        subject.name = name;
        await subject.save();

        res.send({
            error: 0,
            message: 'Subject updated successfully'
        })
    } catch(e) {
        res.status(500).send({
            error: 1,
            message: 'Failed updating subject. ' + e
        })
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try { 
        const subject = await Subject.findByPk(id);

        if(subject === null){
            throw new Error('Subject not found');
        }

        await subject.destroy();

        res.send({
            error: 0,
            message: 'Subject deleted successfully'
        })
    } catch(e) {
        res.status(500).send({
            error: 1,
            message: 'Failed deleting subject. ' + e
        })
    }
})

module.exports = router;
