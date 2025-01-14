var express = require('express');
var router = express.Router();
const { sequelize, Kelas, KelasTeacher, User, AcademicYear } = require("../models");
const include = [{
    model: KelasTeacher,
    as: 'teachers',
    attributes: ['teacher_id', 'is_main'],
    include: {
        model: User,
        as: 'user',
        attributes: ['name']
    }
}, {
    model: AcademicYear,
    as: 'academic_year', 
    attributes: ['id', 'name']
}]

/**
 * LIST RECORDS
 */
router.get('/', async (req, res) => {
    const classes = await Kelas.findAll({
        attributes: ['id', 'name'],
        include
    });

    res.send(classes);
});

/**
 * CREATE RECORD
 */
router.post('/', async (req, res) => {
    const { name, academic_year_id, teachers } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const kelas = await Kelas.create({
            name,
            academic_year_id
        }, {
            transaction
        });

        let teacherData = teachers.map(t => {
            return {
                kelas_id: kelas.id,
                teacher_id: t.id,
                is_main: t.is_main
            };
        });

        await KelasTeacher.bulkCreate(teacherData, { transaction });

        res.send({
            error: 0,
            message: 'Class created successfully'
        })

        await transaction.commit();
    } catch (e) {
        console.log(e);

        await transaction.rollback();
        res.status(500).send({
            error: 1,
            message: 'Failed creating class.'
        });
    }
})

/**
 * GET RECORD DETAIL
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try { 
        const kelas = await Kelas.findByPk(id, {
            attributes: ['id', 'name'],
            include
        });
        
        if(kelas === null){
            throw new Error('Class not found');
        }

        res.send(kelas)
    } catch(e) {
        res.status(404).send({
            error: 1,
            message: 'Class not found.'
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
            message: 'Subject updated successfully'
        })
    } catch(e) {
        res.status(500).send({
            error: 1,
            message: 'Failed deleting subject. ' + e
        })
    }
})

module.exports = router;
