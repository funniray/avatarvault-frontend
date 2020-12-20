import './App.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

//Route Imports
import AppHeader from "./routes/AppHeader/AppHeader";
import Index from "./routes/Index/Index";
import Search from "./routes/Search/Search";

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <AppHeader/>
        </header>
        <Switch>
          <Route path="/search">
            <Search/>
          </Route>
          <Route path="/">
            <Index/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
