import React, {useContext} from 'react';
import authAPI from '../services/authAPI';
import {NavLink} from 'react-router-dom'
import AuthContext from '../contexts/AuthContext'
import { toast } from 'react-toastify';

const NavBar = ({ history }) => {

  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext)

  const handleLogout= () => {
    authAPI.logout()
    setIsAuthenticated(false);
    toast.info("Vous êtes déconnecté")
    history.push("/login")

  }
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <NavLink className="navbar-brand" to="/">
          Application
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/customers">
                Clients
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/invoices">
                Factures
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            {!isAuthenticated &&
            <>
                          <li className="nav-item">
              <NavLink className="btn btn-success" to="/register">
                Inscription
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">
                Connexion
              </NavLink>
            </li>
            </> ||
            <li className="nav-item">
              <button className="btn btn-danger" onClick={handleLogout}>
                Déconnexion
              </button>
            </li>
            }
          </ul>
        </div>
      </nav>
    );
};


export default NavBar;