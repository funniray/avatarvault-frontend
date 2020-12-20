import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

//Route Imports
import AppHeader from "./routes/AppHeader/AppHeader";
import Index from "./routes/Index/Index";
import Search from "./routes/Search/Search";
import Upload from "./routes/Upload/Upload";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import React, {Suspense} from "react";
import Sidebar from "./components/Sidebar";

function App() {

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
      () =>
          createMuiTheme({
            palette: {
              type: prefersDarkMode ? 'dark' : 'light',
            },
          }),
      [prefersDarkMode],
  );

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Suspense fallback={<CircularProgress/>}>
          <Router>
            <Sidebar>
              <Switch>
                <Route path="/search">
                  <Search/>
                </Route>
                <Route path="/upload">
                  <Upload/>
                </Route>
                <Route path="/">
                  <Index/>
                </Route>
              </Switch>
            </Sidebar>
          </Router>
        </Suspense>
      </ThemeProvider>
    </div>
  );
}

export default App;
