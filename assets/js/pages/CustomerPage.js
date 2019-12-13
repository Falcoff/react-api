import React, {useState, useEffect} from "react";
import Field from "../components/forms/Field";
import {Link} from "react-router-dom"
import CustomerApi from "../services/customerAPI"
import { X_OK } from "constants";

const CustomerPage = ({match, history}) => {

    const {id = "new"} = match.params

    const [customer,setCustomer,] = useState({
        lastName: "",
        firstName:"",
        email:"",
        company:""
    })

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
    })

    const [editing,setEditing] = useState(false)

    const fetchCustomer = async id => {
        try{
            console.log(id)
            const {firstName, lastName, email, company} =  await CustomerApi.find(id)
            setCustomer ({firstName, lastName, email, company})
        }catch(error){
            console.log(error)
            console.log(error.response)
            console.log(history)
            history.replace("/customers")
        }
    }

    useEffect(() => {
        if(id!=="new"){
            setEditing(true)
            fetchCustomer(id)
        }
    },[id])


    const handleChange=({currentTarget}) => {
        const {name, value} = currentTarget
        setCustomer({...customer, [name]: value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try{
            if(editing){
                const response = await CustomerApi.update(id, customer)
                console.log(response)
            }else{
                const response = await CustomerApi.createCustomer(customer)
                history.replace("/customers")
            }

            setErrors({})

        } catch({response}){
            console.log(response)
            const {violations} = response.data

            if(violations){
                const apiErrors= {}
                violations.forEach(violation =>{
                    apiErrors[violation.propertyPath] = violation.message
                })
                setErrors(apiErrors)

            }
        }
    }

  return (
    <>
{!editing &&<h1>Création d'un client</h1> || <h1>Modification du client</h1>}
      <form onSubmit={handleSubmit}>
        <Field name="lastName" label="Nom de famille" onChange={handleChange} placeholder="Nom de famille du client" value={customer.lastName} error={errors.lastName}/>
        <Field name="firstName" label="Prénom"  onChange={handleChange} placeholder="Prénom du client" value={customer.firstName} error={errors.firstName}/>
        <Field name="email" label="Email" onChange={handleChange} placeholder="Email du client" value={customer.email} type="email" error={errors.email}/>
        <Field name="company" label="Entreprise" onChange={handleChange} placeholder="Entreprise du client" value={customer.company} error={errors.company}/>
        <div className='form-group'>
            <button className="btn btn-success" type="submit">Enregistrer</button>
            <Link to="/customers" className="btn btn-link">Retour</Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
