import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

//Route Imports
import AppHeader from "./routes/AppHeader/AppHeader";
import Index from "./routes/Index/Index";
import Search from "./routes/Search/Search";
import Upload from "./routes/Upload/Upload";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, {Suspense} from "react";

function App() {
  return (
    <div className="App">
      <Suspense fallback={<CircularProgress/>}>
        <Router>
          <header className="App-header">
            <AppHeader/>
          </header>
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
        </Router>
      </Suspense>
    </div>
  );
}

export default App;
