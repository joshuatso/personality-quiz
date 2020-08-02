import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// redux
import { Provider } from "react-redux"
import store from "./redux/store"

// apollo
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

// styles
import { theme } from "./themes"
import { ThemeProvider } from '@material-ui/core/styles'

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql/quizzes',
  cache: new InMemoryCache()
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
