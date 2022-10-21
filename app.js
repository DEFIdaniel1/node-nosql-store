const express = require('express')
const { router: adminRoutes } = require('./routes/admin')
const shopRouter = require('./routes/shop')
const errorController = require('./controllers/error')

const { mongoConnect } = require('./utils/database')
const User = require('./models/user')

// Express and template setup
const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

// Get user data
app.use((req, res, next) => {
    User.findById('63506d44f9123f11813b5fd9')
        .then((user) => {
            req.user = new User(user.name, user.email, user.cart, user._id)
            next()
        })
        .catch((err) => console.log(err))
})

// ROUTES
app.use('/admin', adminRoutes)
app.use(shopRouter)
app.use(errorController.get404)

// DB Connect
mongoConnect(() => {
    app.listen(3000)
})
