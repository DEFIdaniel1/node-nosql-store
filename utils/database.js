const mongodb = require('mongodb')
require('dotenv').config()
const MongoClient = mongodb.MongoClient
const mongodbPassword = process.env.MONGO_DB_PASSWORD

let db

const mongoConnect = (callback) => {
    MongoClient.connect(
        `mongodb+srv://dpisterzi:${mongodbPassword}@cluster0.wdwpbii.mongodb.net/?retryWrites=true&w=majority`
    )
        .then((client) => {
            console.log('Connected!')
            _db = client.db()
            callback()
        })
        .catch((err) => {
            console.log(err)
            throw err
        })
}

const getDb = () => {
    if (db) {
        return db
    }
    throw 'No database found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
