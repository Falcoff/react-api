import React, {useState} from 'react';
import Field from '../components/forms/Field';
import {Link} from "react-router-dom"
import userApi from '../services/userAPI'
const RegisterPage = ({ history }) => {

    const [user,setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm:""
    })

    const [errors,setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm:""
    })

    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
      };

      const handleSubmit = async event => {
          event.preventDefault()

          const apiErrors = {...errors}
          if(user.password !== user.passwordConfirm){
              apiErrors.passwordConfirm="Votre mot de passe n'est pas identique"
              setErrors(apiErrors)
              return ;
          }



          try{
            const response = await userApi.register
            setErrors({})
            history.replace('/login')
          } catch (error){
            console.log(error.response)
            const {violations} = error.response.data
            if(violations){
                violations.forEach(violation =>{
                    apiErrors[violation.propertyPath] = violation.message
                })
                setErrors(apiErrors)
            }
          }
      }

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field name="firstName" label="Prénom" placeholder="Prénom" error={errors.firstName} onChange={handleChange} value={user.firstName} />
                <Field name="lastName" label="Nom de Famille" placeholder="Nom de famille" error={errors.lastName} onChange={handleChange} value={user.lastName} />
                <Field name="email" label="Email" placeholder="Prénom" error={errors.email} onChange={handleChange} value={user.email} type="email"/>
                <Field name="password" label="Mot de passe" placeholder="Mot de passe" error={errors.password} onChange={handleChange} value={user.password} type="password"/>
                <Field name="passwordConfirm" label="Confirmation de mot de passe" placeholder="Confirmation de mot de passe" type="password" error={errors.passwordConfirm} onChange={handleChange} value={user.passwordConfirm} />

                <div className="form-group" >
                    <button typ="submit" className="btn btn-success"> Confirmation</button>
                    <Link to="/login" className="btn btn-link">Je me connecte</Link>
                </div>
            </form>
        </>
    );
};

export default RegisterPage;