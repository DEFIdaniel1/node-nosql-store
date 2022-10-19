const getDb = require('../utils/database').getDb
const mongodb = require('mongodb')

class Product {
    constructor(title, price, description, imageUrl, id) {
        this.title = title
        this.price = price
        this.description = description
        this.imageUrl = imageUrl
        this._id = id
    }

    save() {
        const db = getDb()
        let dbOp
        //update product if ID already exists
        if (this._id) {
            dbOp = db
                .collection('products')
                .updateOne({ _id: mongodb.ObjectId(this._id) }, { $set: this })
        } else {
            //create new db product
            dbOp = db.collection('products').insertOne(this)
        }
        return dbOp
            .then((result) => {
                console.log(result)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    static fetchAll() {
        const db = getDb()
        return (
            db
                .collection('products')
                //search within the collection with .find() can add .handles after to specify more
                .find()
                //only want to convert to array w/ less than 100 docs. else use pagination
                .toArray()
                .then((products) => {
                    console.log(products)
                    return products
                })
                .catch((err) => {
                    console.log(err)
                })
        )
    }

    static findById(prodId) {
        const db = getDb()
        return (
            db
                .collection('products')
                // new item since it's a constructor?
                .find({ _id: mongodb.ObjectId(prodId) })
                .next()
                .then((product) => {
                    console.log(product)
                    return product
                })
                .catch((err) => console.log(err))
        )
    }
}

module.exports = Product
