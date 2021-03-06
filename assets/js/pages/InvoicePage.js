import React, {useState, useEffect} from 'react';
import Field from '../components/forms/Field';
import Select from "../components/forms/Select"
import {Link} from "react-router-dom"
import CustomerApi from "../services/customerAPI"
import invoicesAPI from '../services/invoicesAPI';
import FormContentLoader from '../components/loaders/FormContentLoader';


const InvoicePage = ({history, match}) => {

  const {id = 'new'} = match.params;

  const [invoice, setInvoice] = useState({
    amount: "",
    customer: "",
    status: "SENT"
  });

  const [customers, setCustomers] = useState([]);

  const [editing, setEditing] = useState(false)

  const [errors, setErrors] = useState({
    amount: "",
    customer: "",
    status: ""
  });
  const [loading, setLoading] = useState(true)

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  const fetchInvoice = async id => {
      try {
        const data = await invoicesAPI.find(id)
        const {amount, status, customer} = data
        setInvoice({amount, status, customer : customer.id})
        setLoading(false)
      }catch({response}) {
        console.log(response)
      }
  }

  useEffect(() => {
      fetchCustomers();
  }, [])

  useEffect(() =>{
    if(id !== 'new') {
        setEditing(true);
        fetchInvoice(id)
    }
  }, [id])

  const fetchCustomers = async () => {
      try{
        const data = await CustomerApi.findAll()
        setCustomers(data)
        setLoading(false)
        if(!invoice.customer) setInvoice({...invoice, customer: data[0].id})
      } catch(error){
        console.log(error.response)
        history.replace('/invoices')
      }
  }

  const handleSubmit = async event =>{
      event.preventDefault()
      
      try{
          if(editing){
            await invoicesAPI.update(id, invoice)

          } else {
            await invoicesAPI.create(invoice)
            history.replace("/invoices")
        }


        } catch (error){
            const response = error.response
            console.log(response)
        if(response){

        
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
  }



  return (
    <>
      {!editing && <h1>Creation d'une facture</h1> ||<h1>Modification d'une facture</h1>}
      {loading &&<FormContentLoader/>}
      {!loading &&<form onSubmit={handleSubmit}>
        <Field
          name="amount"
          type="number"
          placeholder="Montant de la facture"
          label="Montant"
          value={invoice.amount}
          onChange={handleChange}
          error={errors.amount}
        />
        <Select name="customer" label="Client" value={invoice.customer} error={errors.customer} onChange={handleChange}>
            {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)}
        </Select>
        <Select name="status" label="Statut" value={invoice.status} error={errors.status} onChange={handleChange}>
            <option value="SENT">Envoyée</option>
            <option value="PAID">Payée</option>
            <option value="CANCELLED">Annulée</option>
        </Select>
        <div className="form-group">
            <button className="btn btn-success" type="submit">Enregistrer</button>
            <Link to="/invoices" className="btn btn-link">Retour aux factures</Link>
        </div>
      </form>}
    </>
  );
};

export default InvoicePage;