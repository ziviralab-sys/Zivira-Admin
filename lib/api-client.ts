import type { ApiEnvelope, CompanyDashboard, DcrExtended, Doctor, Employee, Product } from "@zivira/types";

export type SubdivisionProduct = {
  id: string;
  name: string;
  description?: string | null;
  saleUnit?: string | null;
  category: string;
  group?: string | null;
  subDivision: string;
};

export type SubdivisionFieldForce = {
  id: string;
  name: string;
  designation: string;
  hq?: string | null;
  reportingTo?: string | null;
  subDivision: string;
};

export type ProductCategory = {
  id: string;
  shortName?: string | null;
  categoryName: string;
  noOfProducts: number;
  sortOrder?: number | null;
  status: "ACTIVE" | "INACTIVE";
};

export type ProductBrand = {
  id: string;
  shortName?: string | null;
  brandName: string;
  noOfProducts: number;
  noOfSlides?: number | null;
  sortOrder?: number | null;
  status: "ACTIVE" | "INACTIVE";
};

export type ProductCatalogItem = {
  id: string;
  productCode?: string | null;
  productName: string;
  description?: string | null;
  saleUnit?: string | null;
  noOfSlides?: number | null;
  sortOrder?: number | null;
  status: "ACTIVE" | "INACTIVE";
};

export type DoctorCategory = {
  id: string;
  shortName?: string | null;
  categoryName: string;
  noOfDoctors: number;
  noOfVisit?: number | null;
  sortOrder?: number | null;
  status: "ACTIVE" | "INACTIVE";
};

export type DoctorSpeciality = {
  id: string;
  shortName?: string | null;
  specialityName: string;
  noOfDoctors: number;
  noOfSlides?: number | null;
  sortOrder?: number | null;
  status: "ACTIVE" | "INACTIVE";
};

export type DoctorQualification = {
  id: string;
  qualificationName: string;
  noOfDoctors: number;
  sortOrder?: number | null;
  status: "ACTIVE" | "INACTIVE";
};

export type Subdivision = {
  id: string;
  tenantSlug: string;
  shortName: string;
  subdivisionName: string;
  productwiseCount: number;
  fieldforcewiseCount: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://zivira-labs-backend-1.onrender.com/api";
const TOKEN_KEY = "zivira.company.token";

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}) {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers
    }
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? "API request failed");
  }

  return payload as ApiEnvelope<T>;
}

export type DcrRecord = Omit<DcrExtended, "doctorId" | "samplesGiven" | "inputsGiven" | "jointWork"> & {
  doctorId?: Doctor;
  managerId?: { displayName?: string };
  visitOutcome?: string;
  outcomeNotes?: string;
  nextFollowUpDate?: string;
  isAutoApproved?: boolean;
  samplesGiven?: { product?: string; productName?: string; qty: number }[];
  inputsGiven?: { inputType?: string; inputName?: string; qty: number }[];
  jointWork?: DcrExtended["jointWork"] & { wasJoint?: boolean; managerName?: string };
};

export type DcrFilters = {
  visitOutcome?: string;
  callSession?: string;
  employeeCode?: string;
};

export type ManagerActivityRecord = {
  manager: Pick<Employee, "id" | "name" | "role">;
  approved: number;
  rejected: number;
  autoApproved: number;
  pending: number;
  autoApproveRate: number;
  flagged: boolean;
};

function toQueryString(filters?: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
}

export const apiClient = {
  login(username: string, password: string) {
    return request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password, portal: "COMPANY_ADMIN" })
    });
  },

  dashboard() {
    return request<CompanyDashboard>("/company/dashboard");
  },

  async employees() {
    const data: Employee[] = [
      {
        id: "emp-1",
        tenantSlug: "sandbox",
        name: "S.SIVANESAN",
        employeeCode: "E0004",
        designation: "SALES MANAGER",
        division: "ASTRA",
        reportingManager: "",
        territory: "HQ-1",
        role: "MR",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "emp-2",
        tenantSlug: "sandbox",
        name: "K. MARIAPPAN",
        employeeCode: "E0006",
        designation: "REGIONAL BUSINESS MANAGER",
        division: "ASTRA",
        reportingManager: "",
        territory: "HQ-2",
        role: "MR",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    return { data };
  },

  createEmployee(input: Omit<Employee, "id" | "tenantSlug" | "createdAt" | "updatedAt">) {
    return request<Employee>("/company/employees", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  async doctors() {
    const data: Doctor[] = [
      {
        id: "doc-1",
        tenantSlug: "sandbox",
        name: "ANIL ANJAYA",
        specialty: "CARDIOLOGY",
        category: "A",
        state: "KARNATAKA",
        city: "BENGALURU",
        territory: "KUKATPALLY",
        mappedEmployeeCode: "E0263",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    return { data };
  },

  createDoctor(input: Omit<Doctor, "id" | "tenantSlug" | "createdAt" | "updatedAt">) {
    return request<Doctor>("/company/doctors", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  products() {
    return request<Product[]>("/company/products");
  },

  dcrs(filters?: DcrFilters) {
    return request<DcrRecord[]>(`/company/dcrs${toQueryString(filters)}`);
  },

  dcrDetail(id: string) {
    return request<DcrRecord>(`/company/dcrs/${id}`);
  },

  approveDcr(id: string) {
    return request<DcrExtended>(`/company/dcrs/${id}/approve`, { method: "POST" });
  },

  managerActivity() {
    return request<ManagerActivityRecord[]>("/company/manager-activity");
  },

  subdivisions() {
    return request<Subdivision[]>("/company/subdivisions");
  },

  createSubdivision(input: { shortName: string; subdivisionName: string; productwiseCount?: number; fieldforcewiseCount?: number }) {
    return request<Subdivision>("/company/subdivisions", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  updateSubdivision(id: string, input: Partial<{ shortName: string; subdivisionName: string; productwiseCount: number; fieldforcewiseCount: number }>) {
    return request<Subdivision>(`/company/subdivisions/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  deactivateSubdivision(id: string) {
    return request<Subdivision>(`/company/subdivisions/${id}/deactivate`, { method: "POST" });
  },

  productsBySubdivision(subDivision: string) {
    return request<SubdivisionProduct[]>(`/company/products?subDivision=${encodeURIComponent(subDivision)}`);
  },

  fieldForceBySubdivision(subDivision: string) {
    return request<SubdivisionFieldForce[]>(`/company/fieldforce?subDivision=${encodeURIComponent(subDivision)}`);
  },

  async productCategories() {
    const data: ProductCategory[] = [
      {
        id: "cat-1",
        shortName: "ANTIALLEGY",
        categoryName: "ANTIALLEGY",
        noOfProducts: 4,
        status: "ACTIVE"
      },
      {
        id: "cat-2",
        shortName: "ANTI-INFECTIVE",
        categoryName: "ANTI-INFECTIVE",
        noOfProducts: 2,
        status: "ACTIVE"
      }
    ];
    return { data };
  },

  createProductCategory(input: { shortName?: string | null; categoryName: string }) {
    return request<ProductCategory>("/company/product-categories", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  updateProductCategory(id: string, input: Partial<{ shortName: string | null; categoryName: string; sortOrder: number | null }>) {
    return request<ProductCategory>(`/company/product-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  deactivateProductCategory(id: string) {
    return request<ProductCategory>(`/company/product-categories/${id}/deactivate`, { method: "POST" });
  },

  reactivateProductCategory(id: string) {
    return request<ProductCategory>(`/company/product-categories/${id}/reactivate`, { method: "POST" });
  },

  async productBrands() {
    const data: ProductBrand[] = [
      {
        id: "brand-1",
        shortName: "BEPIREX",
        brandName: "BEPIREX",
        noOfProducts: 1,
        noOfSlides: 5,
        status: "ACTIVE"
      },
      {
        id: "brand-2",
        shortName: "BRINZIA",
        brandName: "BRINZIA",
        noOfProducts: 1,
        noOfSlides: 3,
        status: "ACTIVE"
      }
    ];
    return { data };
  },

  createProductBrand(input: { shortName?: string | null; brandName: string }) {
    return request<ProductBrand>("/company/product-brands", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  updateProductBrand(id: string, input: Partial<{ shortName: string | null; brandName: string; sortOrder: number | null }>) {
    return request<ProductBrand>(`/company/product-brands/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  deactivateProductBrand(id: string) {
    return request<ProductBrand>(`/company/product-brands/${id}/deactivate`, { method: "POST" });
  },

  reactivateProductBrand(id: string) {
    return request<ProductBrand>(`/company/product-brands/${id}/reactivate`, { method: "POST" });
  },

  async productCatalog() {
    const data: ProductCatalogItem[] = [
      {
        id: "prod-1",
        productCode: "ZL_PRD_01",
        productName: "BEPIREX",
        description: "BEPOTASTINE BESILATE",
        saleUnit: "10 ML",
        noOfSlides: 5,
        status: "ACTIVE"
      },
      {
        id: "prod-2",
        productCode: "ZL_PRD_02",
        productName: "BRINZIA",
        description: "BRINZOLAMIDE AND BRIMONIDINE TARTRATE",
        saleUnit: "5 ML",
        noOfSlides: 3,
        status: "ACTIVE"
      }
    ];
    return { data };
  },

  createProductCatalogItem(input: { productCode?: string | null; productName: string; description?: string | null; saleUnit?: string | null }) {
    return request<ProductCatalogItem>("/company/product-catalog", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  updateProductCatalogItem(id: string, input: Partial<{ productCode: string | null; productName: string; description: string | null; saleUnit: string | null; sortOrder: number | null }>) {
    return request<ProductCatalogItem>(`/company/product-catalog/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  deactivateProductCatalogItem(id: string) {
    return request<ProductCatalogItem>(`/company/product-catalog/${id}/deactivate`, { method: "POST" });
  },

  reactivateProductCatalogItem(id: string) {
    return request<ProductCatalogItem>(`/company/product-catalog/${id}/reactivate`, { method: "POST" });
  },

  doctorCategories() {
    return request<DoctorCategory[]>("/company/doctor-categories");
  },

  createDoctorCategory(input: { shortName?: string | null; categoryName: string }) {
    return request<DoctorCategory>("/company/doctor-categories", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  updateDoctorCategory(id: string, input: Partial<{ shortName: string | null; categoryName: string; sortOrder: number | null }>) {
    return request<DoctorCategory>(`/company/doctor-categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  deactivateDoctorCategory(id: string) {
    return request<DoctorCategory>(`/company/doctor-categories/${id}/deactivate`, { method: "POST" });
  },

  reactivateDoctorCategory(id: string) {
    return request<DoctorCategory>(`/company/doctor-categories/${id}/reactivate`, { method: "POST" });
  },

  doctorSpecialities() {
    return request<DoctorSpeciality[]>("/company/doctor-specialities");
  },

  createDoctorSpeciality(input: { shortName?: string | null; specialityName: string }) {
    return request<DoctorSpeciality>("/company/doctor-specialities", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  updateDoctorSpeciality(id: string, input: Partial<{ shortName: string | null; specialityName: string; sortOrder: number | null }>) {
    return request<DoctorSpeciality>(`/company/doctor-specialities/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  deactivateDoctorSpeciality(id: string) {
    return request<DoctorSpeciality>(`/company/doctor-specialities/${id}/deactivate`, { method: "POST" });
  },

  reactivateDoctorSpeciality(id: string) {
    return request<DoctorSpeciality>(`/company/doctor-specialities/${id}/reactivate`, { method: "POST" });
  },

  doctorQualifications() {
    return request<DoctorQualification[]>("/company/doctor-qualifications");
  },

  createDoctorQualification(input: { qualificationName: string }) {
    return request<DoctorQualification>("/company/doctor-qualifications", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  updateDoctorQualification(id: string, input: Partial<{ qualificationName: string; sortOrder: number | null }>) {
    return request<DoctorQualification>(`/company/doctor-qualifications/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  deactivateDoctorQualification(id: string) {
    return request<DoctorQualification>(`/company/doctor-qualifications/${id}/deactivate`, { method: "POST" });
  },

  reactivateDoctorQualification(id: string) {
    return request<DoctorQualification>(`/company/doctor-qualifications/${id}/reactivate`, { method: "POST" });
  }
};
