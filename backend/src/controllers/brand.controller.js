import { crudController } from "./_crud.js";
import { brandService } from "../services/brand.service.js";
export const { listBrand, getBrandById, createBrand, updateBrand, deleteBrand } = crudController(brandService, "Brand");
