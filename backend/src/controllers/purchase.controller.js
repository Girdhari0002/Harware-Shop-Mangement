import { crudController } from "./_crud.js";
import { purchaseService } from "../services/purchase.service.js";
export const { listPurchase, getPurchaseById, createPurchase, updatePurchase, deletePurchase } = crudController(purchaseService, "Purchase");
