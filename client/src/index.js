import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { BrowserRouter } from "react-router-dom"

// redux
import { Provider } from "react-redux"
import store from "./redux/store"

// apollo
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// styles
import { theme } from "./themes"
import { ThemeProvider } from '@material-ui/core/styles'

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql'
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
