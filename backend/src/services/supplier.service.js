import { Supplier } from "../models/Supplier.model.js";
import { createCrudService } from "./base.service.js";

export const supplierService = createCrudService(Supplier, "suppliers", { uniqueFields: ["email"] });
