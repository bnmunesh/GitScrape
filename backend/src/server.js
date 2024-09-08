const express = require('express')
const cors = require('cors')
const router = require('./routes/userRouter.js')
const app = express()


var corOptions ={
    origin: 'https://localhost:8081'
}


//middlewares

app.use(cors(corOptions))

app.use(express.json())

app.use(express.urlencoded({extended: true}))

app.use('/api', router);

//testing api

app.get('/',(req,res) => {
    res.send('Welcome to the GitScrape! <br>GitScrape is a GitHub repo explorer using GitHub\'s API')
})

//port
const PORT = process.env.PORT || 8080

//server

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})