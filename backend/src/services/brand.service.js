import { Brand } from "../models/Brand.model.js";
import { createCrudService } from "./base.service.js";

export const brandService = createCrudService(Brand, "brands", { uniqueFields: ["name"] });
