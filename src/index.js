import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

import createStore from './redux/store/store';
import { Provider } from 'react-redux';
//providerは、ラップしたコンポーネントにstoreの情報を渡す。Reactコンポ内でreact-reduxのconnect関数を使えるようにする

import { ConnectedRouter } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core';
import { theme } from './assets/theme'

import * as History from 'history';
const history = History.createBrowserHistory();

export const store = createStore(history);
// 実行しないとstore作られないよ

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
