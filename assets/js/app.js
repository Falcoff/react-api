import React from "react";
import ReactDOM from "react-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import { HashRouter, Switch, Route } from "react-router-dom";
import CustomerPage from "./pages/CustomerPage";
import InvoicesPage from "./pages/InvoicesPage";

require("../css/app.css");

const App = () => {
  return (
    <HashRouter>
      <NavBar />
      <main e="container pt-5">
        <Switch>
        <Route path="/invoices" component={InvoicesPage} />

          <Route path="/customers" component={CustomerPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </main>
    </HashRouter>
  );
};

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
