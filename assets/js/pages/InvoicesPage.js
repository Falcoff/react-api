import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesApi from "../services/invoicesAPI"
import moment from 'moment'
import {Link } from 'react-router-dom'


const STATUS_CLASSES = {
    PAID: "succes",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}
const itemsPerPage = 10;

const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");


  const fetchInvoices = async () => {
    try {
        const data = await InvoicesApi.getInvoices()
        setInvoices(data)
    } catch (error){
      console.log(error.response)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, []);

  const formatDate = (str) => moment(str).format('DD/MM/YYYY')

  const handleDelete = async id => {
    const originalInvoices = [...invoices];
    setInvoices(invoices.filter(invoices => invoices.id !== id));

    try{
        await InvoicesApi.delete(id)
    } catch(error){
        setInvoices(originalInvoices);
        console.log(error.response);
    }
  };

  const handleSearch = event => {
    const value = event.currentTarget.value;
    setSearch(value);
    setCurrentPage(1);
  };


  const filteredInvoices = invoices.filter(
    i =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.amount.toString().includes(search.toLowerCase()) ||
      STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
  );

  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  const handleChangePage = page => {
    setCurrentPage(page);
  };

  return (
    <>
    <div className="d-flex justify-content-between align-items-center">
      <h1>Liste des factures</h1>
      <Link className='btn btn-primary' to="/invoices/new">Créer une facture</Link>
    </div>
      <div className="form-group">
        <input
          className="form-control"
          onChange={handleSearch}
          value={search}
          placeholder="Rechercher ..."
        ></input>
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.chrono}</td>
              <td>
                  <a href="#">
                    {invoice.customer.firstName} {invoice.customer.lastName}
                  </a>
              </td>
              <td className="text-center">{formatDate(invoice.sentAt)}</td>
              <td className="text-center">
                <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="text-center">
                {invoice.amount.toLocaleString()} €
              </td>
              <td>
                <Link className="btn btn-sm btn-primary" to={"/invoices/" + invoice.id}>Editer</Link>&nbsp;
                <button
                  onClick={() => handleDelete(invoice.id)}
                  className="btn btn-sm btn-danger"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={invoices.length}
          onPageChanged={handleChangePage}
        />
    </>
  );
};

export default InvoicesPage;
