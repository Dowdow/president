import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import App from './components/App';
import appReducer from './reducers';
import './scss/index.scss';

const store = createStore(
	appReducer,
	composeWithDevTools(applyMiddleware(thunkMiddleware))
);

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>
	, document.getElementById('root'),
);