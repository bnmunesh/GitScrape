const express = require('express');
const cors = require('cors');
const db = require('./models');
const router = require('./routes/userRouter.js');

const app = express();

// Middlewares
app.use(cors({
      origin: ["http://localhost:5173"],
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      credentials: true,
    })
  );

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api', router);


// Testing api
app.get('/',(req,res) => {
    res.send('Welcome to the GitScrape! <br>GitScrape is a GitHub repo explorer using GitHub\'s API')
})

//port
const PORT = process.env.PORT || 8080

console.log(Object.keys(db));
//server
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to sync database:', err);
    console.error('Error details:', JSON.stringify(err, null, 2));
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});