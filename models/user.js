const { getDb } = require('../utils/database')
const mongodb = require('mongodb')

class User {
    constructor(username, email) {
        this.name = username
        this.email = email
    }

    save() {
        const db = getDb()
        return db.collection('users').insertOne(this)
    }

    static findById(userId) {
        const db = getDb()
        return db.collection('users').findOne({ _id: mongodb.ObjectId(userId) })
    }
}
module.exports = User
