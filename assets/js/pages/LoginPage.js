import React, {useState, useContext} from "react";
import authAPI from "../services/authAPI";
import AuthContext from "../contexts/AuthContext"
import Field from "../components/forms/Field"
import { toast } from "react-toastify";

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
        toast.success("Vous êtes désormais connecté")
        history.replace("/customers")
    } catch (error) {
        setError("Aucun compte ne possède cette adresse ou alors les informations ne correspondent pas")
        toast.error("Une erreur est survenue")
      }
    console.log(credentials)
}

  return (
    <>
      <h1>Connexion à l'application</h1>
      <form onSubmit={handleSubmit}>
      <Field name="username" label="Adresse Email" value={credentials.username} onChange={handleChange}
         placeholder="Adresse de connexion" error={error}/>
      <Field name="password" label="Mot de passe" value={credentials.password} onChange={handleChange}
         placeholder="Mot de passe" type="password" />
        <div className="form-group">
          <button type="submit" className="btn btn-success">Connexion</button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
