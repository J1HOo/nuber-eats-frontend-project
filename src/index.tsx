import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "./styles/styles.css";
import { ApolloProvider, } from "@apollo/client";
import { client } from './apollo';

ReactDOM.render(
  <React.StrictMode>
      <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
