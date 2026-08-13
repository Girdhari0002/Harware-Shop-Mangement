import { crudController } from "./_crud.js";
import { expenseService } from "../services/expense.service.js";
export const { listExpense, getExpenseById, createExpense, updateExpense, deleteExpense } = crudController(expenseService, "Expense");
