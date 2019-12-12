import React, {useState, useContext} from "react";
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext"

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext)

    const [credentials, setCredentials] = useState({
        username:"",
        password: ""
    })

    const[error, setError] = useState("");

const handleChange = (event) =>{
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;
    setCredentials({...credentials, [name] : value})
}

const handleSubmit= async event =>{
    event.preventDefault();

    try{
        await authAPI.authenticate(credentials)
        setError("");
        setIsAuthenticated(true)
        history.replace("/customers")
    } catch (error) {
        setError("Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas")
    }
    console.log(credentials)
}

  return (
    <>
      <h1>Connexion à l'application</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="_username">Adresse Email</label>
          <input
          onChange={handleChange}
            type="text"
            className={"form-control " + (error &&"is-invalid" )}
            placeholder="Adresse de connexion"
            name="username"
            id="username"
            value={credentials.username}
          ></input>
          {error && <p className="invalid-feedback">{error}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="_password">Mot de passe</label>
          <input
                    onChange={handleChange}

            type="password"
            placeholder="Mot de passe"
            className="form-control"
            name="password"
            id="password"
            value={credentials.password}

          ></input>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-success">Connexion</button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
