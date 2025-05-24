const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolver');
const { sequelize } = require('./model');
const cors = require('cors');


(async () => {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
    formatError: (err) => ({
      message: err.message,
      code: err.extensions?.code || 'INTERNAL_SERVER_ERROR',
      path: err.path,
    }),
  });


  await server.start();
  server.applyMiddleware({ app });


  await sequelize.sync({ alter: true });

  const PORT = process.env.PORT || 4000;
  app.listen({ port: process.env.PORT }, () =>
    console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
})();
