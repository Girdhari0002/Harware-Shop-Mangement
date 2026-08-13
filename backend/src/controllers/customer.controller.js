import { crudController } from "./_crud.js";
import { customerService } from "../services/customer.service.js";
export const { listCustomer, getCustomerById, createCustomer, updateCustomer, deleteCustomer } = crudController(customerService, "Customer");
