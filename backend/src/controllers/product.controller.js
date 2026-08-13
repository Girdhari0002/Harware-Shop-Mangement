import { crudController } from "./_crud.js";
import { productService } from "../services/product.service.js";
export const { listProduct, getProductById, createProduct, updateProduct, deleteProduct } = crudController(productService, "Product");
