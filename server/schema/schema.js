const graphql = require('graphql')
const {GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLInt, GraphQLList} = graphql

const Movies = require('../models/movie')
const Directors = require('../models/director')

// const movies = [
//   { id: '1', name: 'Pulp Fiction', genre: 'Crime', directorId: '1', },
//   { id: '2', name: '1984', genre: 'Sci-Fi', directorId: '2', },
//   { id: '3', name: 'V for vendetta', genre: 'Sci-Fi-Triller', directorId: '3', },
//   { id: '4', name: 'Snatch', genre: 'Crime-Comedy', directorId: '4', },
//   { id: '5', name: 'Reservoir Dogs', genre: 'Crime', directorId: '1' },
//   { id: '6', name: 'The Hateful Eight', genre: 'Crime', directorId: '1' },
//   { id: '7', name: 'Inglourious Basterds', genre: 'Crime', directorId: '1' },
//   { id: '8', name: 'Lock, Stock and Two Smoking Barrels', genre: 'Crime-Comedy', directorId: '4' },
// ]

// const directors = [
//   {id: '1', name: 'Quentin Tarantino', age: 55},
//   {id: '2', name: 'Michael Radford', age: 72},
//   {id: '3', name: 'James McTeigue', age: 51},
//   {id: '4', name: 'Guy Ritchie', age: 50},
// ]

// const directorsJson = [
//   { "name": "Quentin Tarantino", "age": 55 }, // 5e4aa9101c9d4400004b8174
//   { "name": "Michael Radford", "age": 72 }, // 5e4aa99b1c9d4400004b8175
//   { "name": "James McTeigue", "age": 51 }, // 5e4aa9b21c9d4400004b8176
//   { "name": "Guy Ritchie", "age": 50 }, // 5e4aa9c91c9d4400004b8177
// ];
//
// const moviesJson = [
//   { "name": "Pulp Fiction", "genre": "Crime", "directorId": "5e4aa9101c9d4400004b8174" },
//   { "name": "1984", "genre": "Sci-Fi", "directorId": "5e4aa99b1c9d4400004b8175" },
//   { "name": "V for vendetta", "genre": "Sci-Fi-Triller", "directorId": "5e4aa9b21c9d4400004b8176" },
//   { "name": "Snatch", "genre": "Crime-Comedy", "directorId": "5e4aa9c91c9d4400004b8177" },
//   { "name": "Reservoir Dogs", "genre": "Crime", "directorId": "5e4aa9101c9d4400004b8174" },
//   { "name": "The Hateful Eight", "genre": "Crime", "directorId": "5e4aa9101c9d4400004b8174" },
//   { "name": "Inglourious Basterds", "genre": "Crime", "directorId": "5e4aa9101c9d4400004b8174" },
//   { "name": "Lock, Stock and Two Smoking Barrels", "genre": "Crime-Comedy", "directorId": "5e4aa9c91c9d4400004b8177" },
// ];


//Описываем схему данных хранящихся в базе для фильма
const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    genre: {type: GraphQLString},
    director: {
      type: DirectorType,
      resolve(parent, args) {
        // return directors.find(director => director.id === parent.id)
        return Directors.findById(parent.directorId);
      },
    },
  })
})

//Описываем схему данных хранящихся в базе для режисера
const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return movies.filter(movie => movie.directorId === parent.id)
        return Movies.findById({directorId: parent.id})
      }
    }
  })
})

// Mutation - тип запроса для создания/изменения данных в DB
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: {type: GraphQLString},
        age: {type: GraphQLInt}
      },
      resolve(parent, args) {
        const director = new Directors({
          name: args.name,
          age: args.age
        })
        return director.save()
      }
    },
    addMovie: {
      type: MovieType,
      args: {
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        directorId: {type: GraphQLID}
      },
      resolve(parent, args) {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId
        })
        return movie.save()
      }
    }
  }
})

// Query - тип запроса для получения данных
const Query = new GraphQLObjectType({
  name: 'Query',
  //Ищем фильм по ID
  fields: {
    movie: {
      type: MovieType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        // return movies.find(movie => movie.id === args.id)
        return Movies.findById(args.id)
      }
    },
    //Ищем режисера по ID
    director: {
      type: DirectorType,
      args: {id: {type: GraphQLID}},
      resolve(parent, args) {
        // return directors.find(director => director.id === args.id)
        return Directors.findById(args.id)
      }
    },
    // Возвращаем все фильмы
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        // return movies
        return Movies.find({})
      }
    },
    // Возвращаем всех режисеров
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        // return directors
        return Directors.find({})
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})
