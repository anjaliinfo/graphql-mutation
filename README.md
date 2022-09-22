# GraphQL Mutation
Graphql Example to understand  Mutations and Resolvers implementation

# Installation

Run npm install in project folder to install the required dependices. 

# Description
 
 Basic CRUD Application with Node.js and GraphQL


Create the GraphQL Server for  Node.js App

	Setup the package.json 

	And also install eslint to help you catch errors in your code ahead of time.

	mkdir node-graphql
	cd node-graphql
	npm init -y
	npm install --save-dev eslint@5.16.0


	Create a new file .eslintrc


		{
	  		"extends": "eslint:recommended",
	  		"parserOptions": {
	    		"ecmaVersion": 2018
	  		},
			"env": {
			    "es6": true,
			    "node": true
			}
	    }

    
    Edit  package.json and the following in scripts section

            {
  		"start": "node .",
  		"test": "eslint ."
	     }

	It allows editors to give warnings and can also use npm test to see list of warnings and errors.


	Here We have created simple crud operations for quotes. 

	For this we have used Apollo Server to setup server and uuid to create distinct IDs for quotes.

	Install Apollo and uuid dependcies

	npm install apollo-server@2.5.0 graphql@14.3.0 uuid@3.3.2  


	Create a new index.js file and the following code 

	const { ApolloServer, gql } = require('apollo-server');
       const uuid = require('uuid/v4');

	const typeDefs = gql`
	  type Quote {
	    id: ID!
	    phrase: String!
	    quotee: String
	  }

	  type Query {
	    quotes: [Quote]
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

	const resolvers = {
	  Query: {
	    quotes: () => Object.values(quotes),
	  },
	};

	const server = new ApolloServer({ typeDefs, resolvers });

	server.listen().then(({ url }) => {
  		console.log(`Server is running at ${url}`); // eslint-disable-line no-console
	}); 

   
   Run npm start within the folder  and the server starts running at http://localhost:4000.

   It takes you to a tool where you can test and run queries .

   Run the following query 

     {
	    quotes {
	      phrase
	      quotee
	    }

      }


  And you will see the output 

	{
	  "data": {
	    "quotes": [
	      {
	        "phrase": "I'm a leaf on the wind. Watch how I soar.",
	        "quotee": "Wash"
	      },
	      {
	        "phrase": "We're all stories in the end.",
	        "quotee": "The Doctor"
	      },
	      {
	        "phrase": "Woah!",
	        "quotee": "Neo"
	      }
	    ]
	  }
	}


	Now Adding CRUD to Graphql Node application.  In GraphQL, editing data is done via a Mutation. Start by defining a few new types in typeDefs.


	type Mutation {
    	addQuote(phrase: String!, quotee: String): Quote
    	editQuote(id: ID!, phrase: String, quotee: String): Quote
    	deleteQuote(id: ID!): DeleteResponse
  	}

  	type DeleteResponse {
    	ok: Boolean!
  	}


   Then create resolvers to handle these mutation types


   const resolvers = {
  	// Add below existing Query resolver
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


   Re-start the server and run the following queries.

    mutation Create {
		addQuote(phrase: "You know nothing, Jon Snow.") {
		    id
		}
	}

	query Read {
	  quotes {
	    id
	    phrase
	    quotee
	  }
	}

	mutation Update($id: ID!) {
	  editQuote(id: $id, quotee: "Ygritte") {
	    id
	    phrase
	    quotee
	  }
	}

	mutation Delete($id: ID!) {
	  deleteQuote(id: $id) {
	    ok
	  }
	}


 Once you get the id of something you want to update or delete, you’ll need to pass the id in as a variable. You can click the QUERY VARIABLES link at the bottom of the page to expand the variable editor, then you’ll just need to use JSON to pass in variables. 

 	{
  		"id": "4ef19b4b-0348-45a5-9a9f-6f68ca9a62e6"
 	}


After running the create query you recive the folowing output

	{
	  "data": {
	    "quotes": [
	      {
		"id": "9fe7d64e-5103-44f1-b4a1-322ab1f812fa",
		"phrase": "I'm a leaf on the wind. Watch how I soar.",
		"quotee": "Wash"
	      },
	      {
		"id": "f597f384-6f33-4f65-83d0-992e1f146d4c",
		"phrase": "We're all stories in the end.",
		"quotee": "The Doctor"
	      },
	      {
		"id": "d6fde7e7-7d6d-45c8-855b-cd50a10f52c7",
		"phrase": "Woah!",
		"quotee": "Neo"
	      },
	      {
		"id": "9e46ec20-1b6a-4bd5-87d6-d53fbf9bd183",
		"phrase": "You know nothing, Jon Snow.",
		"quotee": null
	      },
	      {
		"id": "82c48be4-2bc0-49ff-aa0f-eaa1ad5b6f4d",
		"phrase": "You know nothing, Jon Snow.",
		"quotee": null
	      }
	    ]
        }
   }
