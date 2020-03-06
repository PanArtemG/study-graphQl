const express = require('express')
const graphqlHTTP = require('express-graphql')

const schema = require('../schema/schema')
const mongoose = require('mongoose')


const app = express();
const PORT = 3005;

mongoose.connect('mongodb+srv://admin:admin@cluster0-khtxd.mongodb.net/GraphQL?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

const dbConnection = mongoose.connection
dbConnection.on('error', err => console.log(`Connection error: ${err}`))
dbConnection.once('open', () => console.log(`Connection to DB`))

app.listen(PORT, err => {
  err ? console.log(err) : console.log('Server started!');
});

// mongodb+srv://admin:<password>@cluster0-jnvfo.mongodb.net/test?retryWrites=true&w=majority
// mongo "mongodb+srv://admin@cluster0-khtxd.mongodb.net/test"  --username admin
// mongodb+srv://admin:admin@cluster0-khtxd.mongodb.net/test?retryWrites=true&w=majority
