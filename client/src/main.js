import { createApp, provide, h } from 'vue'
import App from './App.vue'

import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink, concat } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'http://192.168.4.197:3000/graphql',
})

// Cache implementation
const cache = new InMemoryCache()

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIxMjM0NTYiLCJpYXQiOjE2NTEwNjM2OTMsImV4cCI6MTY1MTA2NzI5M30.4e9N0C3MhfFzNdNTN_pVkfXxYMEv1dViyQYxRx97edA'
    }
  }));

  return forward(operation);
})

// Create the apollo client
const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  fetchPolicy:'no-cache',
  cache
})

const app = createApp({
  setup () {
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App)
}).mount('#app')