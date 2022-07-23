import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { muiTheme } from './mui_theme';
import {Grid} from "@mui/material"
import configureStore from './store';
import "./index.css"

const theme = createTheme(muiTheme)

const store = configureStore()

const Root = () => {
  return(
    <BrowserRouter>
        <ThemeProvider theme={theme} >
          <App />
        </ThemeProvider>
    </BrowserRouter>
  )
}

ReactDOM.render(
  <React.StrictMode>
      <ReduxProvider store={store}>
        <Root />
      </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
