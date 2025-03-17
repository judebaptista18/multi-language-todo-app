import { ApolloClient, InMemoryCache } from "@apollo/client";
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT,
  cache: new InMemoryCache(),
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYGRAPH_TOKEN}`,
  },
  connectToDevTools: true,
});

export default client;
