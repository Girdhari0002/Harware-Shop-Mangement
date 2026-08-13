import { crudController } from "./_crud.js";
import { paymentService } from "../services/payment.service.js";
export const { listPayment, getPaymentById, createPayment, updatePayment, deletePayment } = crudController(paymentService, "Payment");
