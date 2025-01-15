var express = require('express');
var router = express.Router();
const { sequelize, Kelas, KelasTeacher, User, AcademicYear } = require("../models");
const include = [{
    model: KelasTeacher,
    as: 'teachers',
    attributes: ['id', 'teacher_id', 'is_main'],
    include: {
        model: User,
        as: 'user',
        attributes: ['id', 'name']
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
                teacher_id: t.teacher_id,
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
    const { name, academic_year_id, teachers } = req.body;

    const transaction = await sequelize.transaction();

    try { 
        const kelas = await Kelas.findByPk(id, {
            transaction
        });

        if(kelas === null){
            throw new Error('Class not found');
        }

        kelas.name = name;
        kelas.academic_year_id = academic_year_id;
        await kelas.save({ transaction });

        const existing_teachers = await KelasTeacher.findAll({
            where: {
                kelas_id: id
            }
        }, {
            transaction
        });

        const existing_teachers_id = existing_teachers.map(t => t.teacher_id);

        console.log(existing_teachers_id);

        for(let teacher of teachers){
            console.log(teacher);
            if(existing_teachers_id.indexOf(teacher.teacher_id) > -1){
                const kt = await KelasTeacher.findByPk(teacher.id, {
                    transaction
                })

                if(kt === null){
                    throw new Error("Model not found");
                }

                kt.teacher_id = teacher.teacher_id;
                kt.kelas_id = id;
                kt.is_main = teacher.is_main;
                await kt.save({ transaction });
            }else{
                await KelasTeacher.create({
                    kelas_id: id,
                    teacher_id: teacher.teacher_id,
                    is_main: teacher.is_main
                }, {
                    transaction
                });
            }
        }

        await transaction.commit();

        res.send({
            error: 0,
            message: 'Class updated successfully'
        })
    } catch(e) {
        await transaction.rollback();

        res.status(500).send({
            error: 1,
            message: 'Failed updating class. ' + e
        })
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try { 
        const kelas = await Kelas.findByPk(id);

        if(kelas === null){
            throw new Error('Class not found');
        }

        await kelas.destroy();

        res.send({
            error: 0,
            message: 'Class deleted successfully'
        })
    } catch(e) {
        res.status(500).send({
            error: 1,
            message: 'Failed deleting class. ' + e
        })
    }
})

module.exports = router;
