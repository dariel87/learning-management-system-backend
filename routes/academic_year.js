var express = require('express');
var router = express.Router();
const { AcademicYear } = require("../models");

/**
 * LIST RECORDS
 */
router.get('/', async (req, res) => {
    const { per_page = 10, page = 1, all} = req.query;
    let years;

    try {
        if(all){
            years = await AcademicYear.findAll();
    
            res.send(years);
        }else{
            years = await AcademicYear.findAndCountAll({
                limit: parseInt(per_page),
                offset: parseInt(per_page) * (parseInt(page) - 1) 
            });
    
            years.total_pages = Math.ceil(years.count / parseInt(per_page));
    
            res.send(years);
        }
    } catch(e) {
        res.header(500).send({
            error: 1,
            message: 'Failed fetch users'
        })
    }
});

/**
 * CREATE RECORD
 */
router.post('/', async (req, res) => {
    const { name } = req.body;

    try {
        await AcademicYear.create({
            name
        });

        res.send({
            error: 0,
            message: 'Academic year created successfully'
        })
    } catch (e) {
        res.status(500).send({
            error: 1,
            message: 'Failed creating academic year.'
        });
    }
})

/**
 * GET RECORD DETAIL
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try { 
        const year = await AcademicYear.findByPk(id);
        
        if(year === null){
            throw new Error('Academic year not found');
        }

        res.send(year)
    } catch(e) {
        res.status(404).send({
            error: 1,
            message: 'Academic year not found.'
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
        const year = await AcademicYear.findByPk(id);

        if(year === null){
            throw new Error('Academic year not found');
        }

        year.name = name;
        await year.save();

        res.send({
            error: 0,
            message: 'Academic year updated successfully'
        })
    } catch(e) {
        res.status(500).send({
            error: 1,
            message: 'Failed updating Academic year. ' + e
        })
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try { 
        const year = await AcademicYear.findByPk(id);

        if(year === null){
            throw new Error('Academic year not found');
        }
        await year.destroy();

        res.send({
            error: 0,
            message: 'Academic year deleted successfully'
        })
    } catch(e) {
        res.status(500).send({
            error: 1,
            message: 'Failed deleting Academic year. ' + e
        })
    }
})

module.exports = router;
