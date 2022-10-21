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
    static findById(userId) {
        const db = getDb()
        return db
            .collection('users')
            .findOne({ _id: new ObjectId(userId) })
            .then((user) => {
                return user
            })
            .catch((err) => {
                console.log(err)
            })
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
    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.cartItems.filter((item) => {
            console.log(item.productId.toString())
            console.log(productId)
            return item.productId.toString() !== productId.toString()
        })
        const db = getDb()
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: { cartItems: updatedCartItems } } }
            )
    }

    getCart() {
        const db = getDb()
        //fetch cart Ids and quantities
        const productIds = []
        const quantities = {}
        this.cart.cartItems.map((item) => {
            let prodId = item.productId
            productIds.push(prodId)
            quantities[prodId.toString()] = item.quantity
        })

        return (
            db
                .collection('products')
                // Output product data (title, etc) for cart/product matches
                .find({ _id: { $in: productIds } })
                .toArray()
                .then((products) => {
                    return products.map((p) => {
                        // add cart quantity to product data
                        return { ...p, quantity: quantities[p._id] }
                    })
                })
                .catch((err) => console.log(err))
        )
    }

    addOrder() {
        const db = getDb()
        //add cart items to an 'orders' collection. getcart data to make more robust order data
        return this.getCart()
            .then((products) => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        name: this.name,
                    },
                }
                return db.collection('orders').insertOne(order)
            })
            .then((result) => {
                //empty user cart
                this.cart = { cartItems: [] }
                //empty cart in database
                return db
                    .collection('users')
                    .updateOne(
                        { _id: new ObjectId(this._id) },
                        { $set: { cart: { cartItems: [] } } }
                    )
            })
    }
    getOrders() {
        const db = getDb()
        db.collection('orders').find()
    }
}

module.exports = User
