import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import LandingPage from "../pages/landing/LandingPage";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ChangePassword from "../pages/auth/ChangePassword";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductList from "../pages/products/ProductList";
import ProductDetails from "../pages/products/ProductDetails";
import ProductImportExport from "../pages/products/ProductImportExport";
import CategoryList from "../pages/categories/CategoryList";
import BrandList from "../pages/brands/BrandList";
import SupplierList from "../pages/suppliers/SupplierList";
import SupplierLedger from "../pages/suppliers/SupplierLedger";
import CustomerList from "../pages/customers/CustomerList";
import CustomerLedger from "../pages/customers/CustomerLedger";
import PurchaseList from "../pages/purchases/PurchaseList";
import PurchaseInvoice from "../pages/purchases/PurchaseInvoice";
import SaleList from "../pages/sales/SaleList";
import SalesInvoice from "../pages/sales/SalesInvoice";
import ExpenseList from "../pages/expenses/ExpenseList";
import PaymentList from "../pages/payments/PaymentList";
import SalesReport from "../pages/reports/SalesReport";
import PurchaseReport from "../pages/reports/PurchaseReport";
import GstReport from "../pages/reports/GstReport";
import StockReport from "../pages/reports/StockReport";
import ProfitReport from "../pages/reports/ProfitReport";
import NotificationCenter from "../pages/notifications/NotificationCenter";
import AttendanceList from "../pages/attendance/AttendanceList";
import CompanyProfile from "../pages/settings/CompanyProfile";
import UserManagement from "../pages/settings/UserManagement";
import RolesPermissions from "../pages/settings/RolesPermissions";
import BackupRestore from "../pages/settings/BackupRestore";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes - Landing page and auth */}
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>

      {/* Protected routes - Dashboard and app */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/details" element={<ProductDetails />} />
          <Route path="/products/import-export" element={<ProductImportExport />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/brands" element={<BrandList />} />
          <Route path="/suppliers" element={<SupplierList />} />
          <Route path="/suppliers/ledger" element={<SupplierLedger />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/ledger" element={<CustomerLedger />} />
          <Route path="/purchases" element={<PurchaseList />} />
          <Route path="/purchases/invoice" element={<PurchaseInvoice />} />
          <Route path="/sales" element={<SaleList />} />
          <Route path="/sales/invoice" element={<SalesInvoice />} />
          <Route path="/expenses" element={<ExpenseList />} />
          <Route path="/payments" element={<PaymentList />} />
          <Route path="/reports/sales" element={<SalesReport />} />
          <Route path="/reports/purchase" element={<PurchaseReport />} />
          <Route path="/reports/gst" element={<GstReport />} />
          <Route path="/reports/stock" element={<StockReport />} />
          <Route path="/reports/profit" element={<ProfitReport />} />
          <Route path="/notifications" element={<NotificationCenter />} />
          <Route element={<AdminRoute />}>
            <Route path="/attendance" element={<AttendanceList />} />
            <Route path="/settings/company-profile" element={<CompanyProfile />} />
            <Route path="/settings/users" element={<UserManagement />} />
            <Route path="/settings/roles-permissions" element={<RolesPermissions />} />
            <Route path="/settings/backup-restore" element={<BackupRestore />} />
          </Route>
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;