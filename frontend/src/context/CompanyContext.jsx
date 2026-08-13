import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { companyService } from "../services/company.service";

export const CompanyContext = createContext(null);

const assetBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/api\/v1\/?$/, "");

const DEFAULT_NAME = "Hardware ERP";

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState({ name: "", logo: "" });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await companyService.getPublic();
      setCompany(res?.data?.data || { name: "", logo: "" });
    } catch (err) {
      // Branding is non-critical — fall back to the default name/logo below.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(() => {
    const logoUrl = company.logo
      ? (company.logo.startsWith("http") ? company.logo : `${assetBaseUrl}${company.logo}`)
      : "";
    return {
      name: company.name || DEFAULT_NAME,
      logoUrl,
      loading,
      refresh
    };
  }, [company, loading, refresh]);

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};
