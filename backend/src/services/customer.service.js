import { Customer } from "../models/Customer.model.js";
import { createCrudService } from "./base.service.js";

export const customerService = createCrudService(Customer, "customers", { uniqueFields: ["email"] });
