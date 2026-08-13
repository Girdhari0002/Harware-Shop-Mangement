import { crudController } from "./_crud.js";
import { categoryService } from "../services/category.service.js";
export const { listCategory, getCategoryById, createCategory, updateCategory, deleteCategory } = crudController(categoryService, "Category");
