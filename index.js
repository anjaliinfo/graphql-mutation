const { ApolloServer, gql } = require('apollo-server');  //graphql server
const uuid = require('uuid/v4');  // to create disctinct ids  for quotes

//Define the structure of data
const typeDefs = gql`
  type Quote {
    id: ID!
    phrase: String!
    quotee: String
  }

  type Query {
    quotes: [Quote]
  }

  type Mutation {
    addQuote(phrase: String!, quotee: String): Quote
    editQuote(id: ID!, phrase: String, quotee: String): Quote
    deleteQuote(id: ID!): DeleteResponse
  }

  type DeleteResponse {
    ok: Boolean!
  }

`;

const quotes = {};
const addQuote = quote => {
  const id = uuid();
  return quotes[id] = { ...quote, id };
};



// Start with a few initial quotes
addQuote({ phrase: "I'm a leaf on the wind. Watch how I soar.", quotee: "Wash" });
addQuote({ phrase: "We're all stories in the end.", quotee: "The Doctor" });
addQuote({ phrase: "Woah!", quotee: "Neo" });

// const resolvers = {
//   Query: {
//     quotes: () => Object.values(quotes),
//   },
// };

const resolvers = {
  // Add below existing Query resolver
  
  Query: {
    quotes: () => Object.values(quotes),
  }, 
 
  Mutation: {
    addQuote: async (parent, quote) => {
      return addQuote(quote);
    },
    editQuote: async (parent, { id, ...quote }) => {
      if (!quotes[id]) {
        throw new Error("Quote doesn't exist");
      }

      quotes[id] = {
        ...quotes[id],
        ...quote,
      };

      return quotes[id];
    },
    deleteQuote: async (parent, { id }) => {
      const ok = Boolean(quotes[id]);
      delete quotes[id];

      return { ok };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server is running at ${url}`); // eslint-disable-line no-console
}); 