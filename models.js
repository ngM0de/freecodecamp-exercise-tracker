import mongoose, {Schema, model} from 'mongoose';

const types = Schema.Types;

export const ExerciseSchema = new Schema({
    username: types.String,
    description: types.String,
    duration: types.Number,
    date: types.String,
    _id: types.String
}, {versionKey: false})

export const ExerciseModel = model('Exercises', ExerciseSchema, 'userExercises')

const UserSchema = new Schema({
    username: types.String
}, {versionKey: false})

export const UserModel = model('User', UserSchema, "users")

const LogsDetailsSchema = new Schema({
    description: types.String,
    duration: types.Number,
    date: types.String,
}, {versionKey: false})

const LogDetailsModel = mongoose.model('LogsDetailsModel', LogsDetailsSchema, 'logs_detail')

const LogsSchema = new Schema({
    username: types.String,
    count: types.Number,
    _id: types.String,
    log: [LogsDetailsSchema]
}, {versionKey: false})

export const LogsModel = mongoose.model('LogsModel', LogsSchema, 'logs')



