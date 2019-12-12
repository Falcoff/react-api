import React, {useState} from "react";
import ReactDOM from "react-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route, withRouter } from "react-router-dom";
import CustomersPage from "./pages/CustomerPage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import authAPI from './services/authAPI'
import AuthContext from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'

require("../css/app.css");

authAPI.setup();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    authAPI.isAuthenticated()
  );
  const NavBarWithRouter = withRouter(NavBar);

  return (
    <AuthContext.Provider value={isAuthenticated, setIsAuthenticated}>
      <HashRouter>
        <NavBarWithRouter />
        <main e="container pt-5">
          <Switch>
            <Route path="/login" component ={LoginPage}/>

            <PrivateRoute
              path="/invoices"
              component={InvoicesPage}
            />
            <PrivateRoute
              path="/customers"
              component={CustomersPage}
            />

            <Route path="/" component={HomePage} />
          </Switch>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);