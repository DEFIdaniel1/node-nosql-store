const express = require('express')
const { router: adminRoutes } = require('./routes/admin')
const shopRouter = require('./routes/shop')
const errorController = require('./controllers/error')
const { mongoConnect } = require('./utils/database')

// Express and template setup
const app = express()
app.set('view engine', 'ejs')
app.set('views', 'views')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('public'))

// Get user data
app.use((req, res, next) => {
    //     User.findByPk(1)
    //         .then((user) => {
    //             req.user = user
    //             next()
    //         })
    //         .catch((err) => console.log(err))
    next()
})

// ROUTES
app.use('/admin', adminRoutes)
app.use(shopRouter)
app.use(errorController.get404)

// DB Connect
mongoConnect(() => {
    app.listen(3000)
})
