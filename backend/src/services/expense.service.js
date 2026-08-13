import { Expense } from "../models/Expense.model.js";
import { createCrudService } from "./base.service.js";

export const expenseService = createCrudService(Expense, "expenses");
