const mongodb = require('mongodb')
const getDb = require('../utils/database').getDb

const ObjectId = mongodb.ObjectId

class User {
    constructor(username, email, cart, id) {
        this.name = username
        this.email = email
        this.cart = cart ? cart : { cartItems: [] }
        this._id = id
    }

    save() {
        const db = getDb()
        return db.collection('users').insertOne(this)
    }

    addToCart(product) {
        const cartProductIndex = this.cart.cartItems.findIndex((cp) => {
            return cp.productId.toString() === product._id.toString()
        })
        const updatedCartItems = [...this.cart.cartItems]

        if (cartProductIndex >= 0) {
            //product already in cart, increment
            updatedCartItems[cartProductIndex].quantity += 1
        } else {
            //adding item first time
            updatedCartItems.push({
                productId: new ObjectId(product._id),
                quantity: 1,
            })
        }
        const updatedCart = { cartItems: updatedCartItems }

        const db = getDb()
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            )
    }

    getCart() {
        const db = getDb()
        const productIds = this.cart.items.map((i) => {
            return i.productId
        })
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then((products) => {
                return products.map((p) => {
                    return {
                        ...p,
                        quantity: this.cart.items.find((i) => {
                            return i.productId.toString() === p._id.toString()
                        }).quantity,
                    }
                })
            })
    }

    static findById(userId) {
        const db = getDb()
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then((user) => {
                console.log(user)
                return user
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

module.exports = User
