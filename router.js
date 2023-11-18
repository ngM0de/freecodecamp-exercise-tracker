import {Router} from 'express'
import {ExerciseModel, LogsModel, UserModel} from "./models.js";

export const router = Router()

router.post('/users', (req, res) => {
    const user = new UserModel({username: req.body.username})
    user.save()
        .then(newUser => {
            const log = new LogsModel({
                _id: user._id, count: 0, username: user.username, log: []
            })
            log.save().then(() => {
                res.json({_id: newUser._id, username: newUser.username})
            }).catch(e => res.json({error: e.message}))
        })
        .catch(e => res.json({error: e.message}))
})

router.get('/users', (req, res) => {
    UserModel.find({})
        .then((users) => res.json(users))
        .catch(e => res.json({error: e.message}))
})

router.post('/users/:_id/exercises', (req, res) => {
    const {description, duration, date} = req.body;
    const isDate = new Date(date).toDateString();

    const payload = {
        description,
        duration,
        date: isDate ? ((isDate && isDate.toString() !== 'Invalid Date') ? isDate : new Date().toDateString()) : new Date().toDateString()
    }
    UserModel.findById(req.params._id).then((user) => {
        // const userExercise = new ExerciseModel({_id: req.params._id, ...payload})


        LogsModel.findOneAndUpdate({_id: req.params._id}, {$push: {log: payload}}, {new: true}).then(logObj => {

            // const output = {
            //     ...exersice._doc,
            //     date: new Date(exersice._doc.date).toDateString(),
            //     username: user.username
            // }
            const output = {
                username: user.username,
                ...payload,
                duration: +payload.duration,
                date: new Date(payload.date).toDateString(),
                _id: req.params._id,
            }
            res.json(output)

            // }).catch((e) => res.json({error: e.message}))

        })
        // })
        // .catch((e) => res.json({error: e.message}))

    }).catch((e) => res.json({error: e.message}));

})


router.get('/users/:_id/logs', async (req, res) => {
    try {
        const {from, to, limit} = req.query;
        const dateObj = {}
        if (from) {
            dateObj['$gte'] = new Date(from).toISOString()
        }
        if (to) {
            dateObj['$lte'] = new Date(to).toISOString()
        }
        let filter = {_id: req.params._id};
        if (from || to) {
            filter.date = dateObj
        }
        const userLog = await LogsModel.findById(req.params._id)
        // const exercises = await ExerciseModel.find({_id: req.params._id}).limit(+limit ?? 500)
        const output = {
            username: userLog.username,
            count: userLog.log.length,
            log: userLog.log.map(log => {
                return ({
                    description: log.description,
                    duration: log.duration,
                    date: new Date(log.date).toDateString()
                })
            }),
            _id: userLog._id,
        }
        output.log = output.log.filter(item => {
            const date = new Date(item.date).getTime()
            return (from ? (date >= new Date(from).getTime()) : true)
                && (to ? (date <= new Date(to).getTime()) : true)
        })
        if (limit) {
            output.log = output.log.slice(0, limit)
        }
        res.json(output)
    } catch (e) {
        console.log(e)
    }

})
