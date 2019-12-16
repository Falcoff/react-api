import axios from "axios"
import Cache from "./cache"
import { CUSTOMERS_API } from "./config"

async function findAll() {
    const cachedCustomers = await Cache.get("customers")
    if(cachedCustomers) return cachedCustomers
        return axios
        .get(CUSTOMERS_API)
        .then(response => {
           const customers = response.data["hydra:member"];
           Cache.set("customers", customers);
           return customers
        })
}

function deleteCustomer(id) {
    return axios
    .delete(CUSTOMERS_API +"/" + id)
    .then(async response => {
        const cachedCustomers = await Cache.get("customers")
        if(cachedCustomers){
            Cache.set("customers", cachedCustomers.filter(c => c.id !== id));
        }
        return response
    })
}

function find(id) {
     return axios.get(CUSTOMERS_API+"/" + id)
     .then(response => response.data);
}

function update(id, customer){
    return axios
    .put(CUSTOMERS_API+"/"+ id, customer)
   .then(async response => {
       const cachedCustomers = await Cache.get("customers")
       if(cachedCustomers){
           const index = cachedCustomers.findIndex(c => c.id === +id)
           const newChachedCustomer = response.data
           cachedCustomers[index] = newChachedCustomer
           Cache.set("customers", cachedCustomers)
       }
       return response
    })
}

function createCustomer(customer){
   return axios
   .post(CUSTOMERS_API, customer)
   .then(async response => {
       const cachedCustomers = await Cache.get("customers")
       if(cachedCustomers){
        Cache.set("customers", [...cachedCustomers, response.data])
        }
    return response
   })
}


export default {
    findAll,
    delete:deleteCustomer,
    find,
    update,
    createCustomer
}