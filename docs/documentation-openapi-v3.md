# API Gateway \(GraphQL\)

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.

More details on [https://graphql.org/](https://graphql.org/)

### 1. Define your GraphQL schema <a id="step-3-define-your-graphql-schema"></a>

Every GraphQL server uses a **schema** to define the structure of data that clients can query. In this example, we'll create a server for querying a collection of books by title and author.

Open `schema.graphql` in your preferred editor and paste the following into it:

```graphql
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# This "Book" type defines the queryable fields for every book in our data source.
type Book {
  title: String
  author: String
}

# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
  books: [Book]
}
```

### 2. Define your data set <a id="step-4-define-your-data-set"></a>

Now that we've defined the _structure_ of our data, we can define the data itself. Yap can fetch data from any source you connect to \(including a database, a REST API, a static object storage service, or even another GraphQL server\). For the purposes of this tutorial, we'll just hardcode some example data.

Add the following to the bottom of `resolvers.ts`:

```javascript
const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];
```

Add the following to the bottom of `resolvers.js`

```javascript
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
};
```

### 3: Create an instance of `Yap` <a id="step-6-create-an-instance-of-apolloserver"></a>

We've defined our schema, data set, and resolver. Now we just need to provide this information to Apollo Server when we initialize it.

Add the following to the bottom of `index.ts`:

```javascript
// The Yap constructor requires three parameters: your schema
// definition, policies and your set of resolvers.
const app = new Yap({ typeDefs, resolvers, policies });
```

