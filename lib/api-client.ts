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

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    "NEXT_PUBLIC_API_URL is not set. Set it to the backend API URL (e.g. in .env.local) — there is no fallback backend."
  );
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const TOKEN_KEY = "zivira.company.token";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

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

  employees() {
    return request<Employee[]>("/company/employees");
  },

  createEmployee(input: Omit<Employee, "id" | "tenantSlug" | "createdAt" | "updatedAt">) {
    return request<Employee>("/company/employees", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  doctors() {
    return request<Doctor[]>("/company/doctors");
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

  productCategories() {
    return request<ProductCategory[]>("/company/product-categories");
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

  productBrands() {
    return request<ProductBrand[]>("/company/product-brands");
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

  productCatalog() {
    return request<ProductCatalogItem[]>("/company/product-catalog");
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
