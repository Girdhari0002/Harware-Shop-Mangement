import { useContext } from "react";
import { CompanyContext } from "../context/CompanyContext";

const useCompany = () => useContext(CompanyContext);

export default useCompany;
