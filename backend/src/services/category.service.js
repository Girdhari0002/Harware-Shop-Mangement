import { Category } from "../models/Category.model.js";
import { createCrudService } from "./base.service.js";

export const categoryService = createCrudService(Category, "categories", { uniqueFields: ["name"] });
