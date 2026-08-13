import { crudController } from "./_crud.js";
import { supplierService } from "../services/supplier.service.js";
export const { listSupplier, getSupplierById, createSupplier, updateSupplier, deleteSupplier } = crudController(supplierService, "Supplier");
