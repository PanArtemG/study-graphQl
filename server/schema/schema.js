const graphql = require('graphql')
const {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLInt} = graphql

const movies = [
  {id: '1', name: 'Pul Fiction', genre: 'Crime', directorId: '1'},
  {id: '2', name: '1984', genre: 'Sci-Fi', directorId: '2'},
  {id: '3', name: 'Vendetta', genre: 'Sci-Fi-Triller', directorId: '3'},
  {id: '4', name: 'Snatch', genre: 'Crime-Comedy', directorId: '4'},
]

const directors = [
  {id: '1', name: 'Quentin Tarantino', age: 55},
  {id: '2', name: 'Michael Radford', age: 72},
  {id: '3', name: 'James Cors', age: 34},
  {id: '4', name: 'Guy Jui', age: 46},
]


const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return directors.find(director => director.id === parent.id)
      }
    }
  })
})

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
  })
})


const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return movies.find(movie => movie.id === args.id)
      }
    },
    director: {
      type: DirectorType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        return directors.find(director => director.id === director.id)
      }
    },
  }
})

module.exports = new GraphQLSchema({
  query: Query,
})
