import type { ApiEnvelope, CompanyBranch, CompanyDashboard, DcrExtended, Doctor, DoctorCoverageRow, Employee, Product, TourPlan } from "@zivira/types";

// Re-exported so other modules (e.g. manager-sfc-updation.tsx) can import
// Employee straight from "@/lib/api-client" instead of reaching into
// "@zivira/types" directly — plain `import type { X } from "pkg"` does NOT
// re-export X to this file's own consumers, which is what broke the
// "declares 'Employee' locally, but it is not exported" Vercel build.
export type { Employee, Product };

export type ProductCategory = {
  id: string;
  shortName?: string | null;
  categoryName: string;
  noOfProducts: number;
  sortOrder?: number | null;
  status: "ACTIVE" | "INACTIVE";
  description?: string | null;
};

export type ProductBrand = {
  id: string;
  shortName?: string | null;
  brandName: string;
  noOfProducts: number;
  noOfSlides?: number | null;
  sortOrder?: number | null;
  status: "ACTIVE" | "INACTIVE";
  molecule?: string | null;
  therapy?: string | null;
  division?: string | null;
};

export type ProductCatalogItem = {
  id: string;
  productCode?: string | null;
  productName: string;
  description?: string | null;
  brandName?: string | null;
  molecule?: string | null;
  therapy?: string | null;
  saleUnit?: string | null;
  noOfSlides?: number | null;
  sortOrder?: number | null;
  status: "ACTIVE" | "INACTIVE";
  strength?: string | null;
  pack?: string | null;
  sku?: string | null;
  division?: string | null;
  uom?: string | null;
};

export type DoctorCategory = {
  id: string;
  shortName?: string | null;
  categoryName: string;
  noOfDoctors: number;
  noOfVisit?: number | null;
  sortOrder?: number | null;
  status: "ACTIVE" | "INACTIVE";
  qualification?: string | null;
  specialty?: string | null;
  registrationNumber?: string | null;
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
  division: string;
  subdivisionName: string;
  productwiseCount: number;
  fieldforcewiseCount: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
};

export type ProductGroup = {
  id: string;
  moleculeName: string;
  therapyName?: string | null;
  status: "ACTIVE" | "INACTIVE";
  description?: string | null;
};

export type Dealer = {
  id: string;
  sourceSNo?: number | null;
  employeeName?: string | null;
  employeeCode?: string | null;
  patchName?: string | null;
  dealerName: string;
  contactPersonName?: string | null;
  dealerPhone?: string | null;
  dealerEmail?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  location?: string | null;
  pincode?: string | null;
  address?: string | null;
  status: "ACTIVE" | "INACTIVE";
};

export type Holiday = {
  id: string;
  sourceSNo?: number | null;
  stateName: string;
  weekendHoliday?: string | null;
  otherHolidayDate?: string | null;
  otherHolidayDescription?: string | null;
  status: "ACTIVE" | "INACTIVE";
};

export type Sfc = {
  id: string;
  sourceSNo?: number | null;
  employeeName?: string | null;
  employeeCode?: string | null;
  hq?: string | null;
  patchName?: string | null;
  typeRaw?: string | null;
  oneWayKms?: number | null;
  region?: string | null;
  status: "ACTIVE" | "INACTIVE";
};

export type Expense = {
  id: string;
  role: string;
  listOfExpenseTypes?: string | null;
  station?: string | null;
  metroType?: string | null;
  amountNC?: number | null;
  dailyWork?: string | null;
  frequency?: string | null;
  remarks?: string | null;
  status: "ACTIVE" | "INACTIVE";
};

export type Hospital = {
  id: string;
  hospitalCode: string;
  hospitalName: string;
  type: "Private" | "Government" | "Trust" | "Other";
  city?: string | null;
  medicalRepresentative?: string | null;
  status: "ACTIVE" | "INACTIVE";
};

export type UnlistedDoctor = {
  id: string;
  tempCode: string;
  name: string;
  specialty?: string | null;
  city?: string | null;
  mr?: string | null;
  clinicName?: string | null;
  address?: string | null;
  area?: string | null;
  state?: string | null;
  pinCode?: string | null;
  patch?: string | null;
  hq?: string | null;
  mobile?: string | null;
  email?: string | null;
  visitFrequency?: string | null;
  potential?: string | null;
  remarks?: string | null;
  approvedBy?: string | null;
  dob?: string | null;
  anniversaryDate?: string | null;
  status: "Pending" | "Approved" | "Rejected";
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
    cache: "no-store",
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

export type PaginationInfo = { page: number; limit: number; total: number; totalPages: number };

async function requestPaginated<T>(path: string, init: RequestInit = {}): Promise<{ data: T[]; pagination: PaginationInfo }> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
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

  return payload as { data: T[]; pagination: PaginationInfo };
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

export type MasterField = {
  key: string;
  label: string;
  type?: "string" | "number" | "date";
  options?: string[];
  sourceMaster?: string;
  sourceField?: string;
  computed?: { fromField: string; sourceMaster: string; lookupField: string; displayField: string };
};
export type MasterSchema = { key: string; title: string; fields: MasterField[]; keyFields: string[] };
export type MasterRecord = { id: string; tenantSlug?: string; createdAt?: string; updatedAt?: string } & Record<string, unknown>;

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

  doctors(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return requestPaginated<Doctor>(`/company/doctors${qs ? `?${qs}` : ""}`);
  },

  clinicNames(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return requestPaginated<string>(`/company/doctors/clinics${qs ? `?${qs}` : ""}`);
  },

  createDoctor(input: Omit<Doctor, "id" | "tenantSlug" | "createdAt" | "updatedAt">) {
    return request<Doctor>("/company/doctors", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  doctorCelebrations(month: number) {
    return request<Doctor[]>(`/company/doctors/celebrations?month=${month}`);
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

  createSubdivision(input: { division: string; subdivisionName: string; productwiseCount?: number; fieldforcewiseCount?: number }) {
    return request<Subdivision>("/company/subdivisions", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  updateSubdivision(id: string, input: Partial<{ division: string; subdivisionName: string; productwiseCount: number; fieldforcewiseCount: number }>) {
    return request<Subdivision>(`/company/subdivisions/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  deactivateSubdivision(id: string) {
    return request<Subdivision>(`/company/subdivisions/${id}/deactivate`, { method: "POST" });
  },

  productCatalogByDivision(division: string) {
    return request<ProductCatalogItem[]>(`/company/product-catalog?division=${encodeURIComponent(division)}`);
  },

  employeesByDivision(division: string) {
    return request<Employee[]>(`/company/employees?division=${encodeURIComponent(division)}`);
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
  },

  productGroups() {
    return request<ProductGroup[]>("/company/product-groups");
  },

  dealers() {
    return request<Dealer[]>("/company/dealers");
  },

  createDealer(input: Omit<Dealer, "id"> & { sourceSNo?: string | number }) {
    return request<Dealer>("/company/dealers", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  updateDealer(id: string, input: Partial<Dealer> & { sourceSNo?: string | number }) {
    return request<Dealer>(`/company/dealers/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  holidays() {
    return request<Holiday[]>("/company/holidays");
  },

  sfc() {
    return request<Sfc[]>("/company/sfc");
  },

  expenses() {
    return request<Expense[]>("/company/expenses");
  },

  hospitals() {
    return request<Hospital[]>("/company/hospitals");
  },

  createHospital(input: Omit<Hospital, "id" | "tenantSlug" | "createdAt" | "updatedAt">) {
    return request<Hospital>("/company/hospitals", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  updateHospital(id: string, input: Partial<Hospital>) {
    return request<Hospital>(`/company/hospitals/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  unlistedDoctors() {
    return request<UnlistedDoctor[]>("/company/unlisted-doctors");
  },

  createUnlistedDoctor(input: Omit<UnlistedDoctor, "id" | "tenantSlug" | "createdAt" | "updatedAt">) {
    return request<UnlistedDoctor>("/company/unlisted-doctors", {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  updateUnlistedDoctor(id: string, input: Partial<UnlistedDoctor>) {
    return request<UnlistedDoctor>(`/company/unlisted-doctors/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  territoryDoctorCounts() {
    return request<{ patch: string; hq: string; division: string; totalDoctors: number; activeDoctors: number }[]>("/company/territory/doctor-counts");
  },

  bulkDeactivateTerritory(patch: string) {
    return request<{ success: boolean; modifiedCount: number }>("/company/territory/bulk-deactivate", {
      method: "POST",
      body: JSON.stringify({ patch })
    });
  },

  // ── Generic "document masters" API — one consistent CRUD surface for all
  // 38 masters defined in the Technical Report (Division, Region/Zone,
  // Territory/HQ, Therapy, Doctor sub-tabs, Stockist sub-tabs, etc.) ──

  masterList() {
    return request<MasterSchema[]>("/company/masters");
  },

  masterSchema(key: string) {
    return request<MasterSchema>(`/company/masters/${key}/schema`);
  },

  masterRecords(key: string) {
    return request<MasterRecord[]>(`/company/masters/${key}`);
  },

  createMasterRecord(key: string, input: Record<string, unknown>) {
    return request<MasterRecord>(`/company/masters/${key}`, {
      method: "POST",
      body: JSON.stringify(input)
    });
  },

  updateMasterRecord(key: string, id: string, input: Record<string, unknown>) {
    return request<MasterRecord>(`/company/masters/${key}/${id}`, {
      method: "PUT",
      body: JSON.stringify(input)
    });
  },

  deactivateMasterRecord(key: string, id: string) {
    return request<MasterRecord>(`/company/masters/${key}/${id}/deactivate`, { method: "POST" });
  },

  reactivateMasterRecord(key: string, id: string) {
    return request<MasterRecord>(`/company/masters/${key}/${id}/reactivate`, { method: "POST" });
  },

  // ── PRD 12.5 — GST Multi-Branch: Admin "Branches & GST" tab ────────────
  branches() {
    return request<CompanyBranch[]>("/company/branches");
  },

  createBranch(input: { branchName: string; gstNumber: string; address: string; city: string; state: string; pincode: string; isHeadquarters?: boolean }) {
    return request<CompanyBranch>("/company/branches", { method: "POST", body: JSON.stringify(input) });
  },

  updateBranch(id: string, input: Partial<{ branchName: string; gstNumber: string; address: string; city: string; state: string; pincode: string; isHeadquarters: boolean; status: "ACTIVE" | "INACTIVE" }>) {
    return request<CompanyBranch>(`/company/branches/${id}`, { method: "PATCH", body: JSON.stringify(input) });
  },

  branchLookup(gst: string) {
    return request<CompanyBranch>(`/company/branches/lookup?gst=${encodeURIComponent(gst)}`);
  },

  // ── PRD 12.1 — Tour Plan (admin read-only, all managers) ───────────────
  adminTourPlans(params?: { month?: string; status?: string }) {
    const qs = toQueryString(params);
    return request<TourPlan[]>(`/company/tour-plans${qs}`);
  },

  // ── PRD 12.2/12.3 — Doctor Coverage MIS: Total Visits, Samples, Gifts ──
  doctorCoverage(month?: string) {
    return request<DoctorCoverageRow[]>(`/company/doctor-coverage${month ? `?month=${month}` : ""}`);
  },

  visitSummaryAdmin(month?: string) {
    return request<{ doctorId: string; doctorName: string; mappedEmployeeCode?: string; visitCount: number; lastVisitDate: string | null; overVisitFlag: boolean }[]>(`/company/visit-summary${month ? `?month=${month}` : ""}`);
  },

  giftValueThreshold() {
    return request<{ GIFT_VALUE_THRESHOLD_RS: number }>("/company/config");
  },

  setGiftValueThreshold(value: number) {
    return request<{ key: string; value: number }>("/company/config/GIFT_VALUE_THRESHOLD_RS", { method: "PATCH", body: JSON.stringify({ value }) });
  },

  // ── Generic company-config store — GET /company/config returns every
  // stored key merged with the server's DEFAULT_CONFIG as one object, so
  // this same read also picks up any custom key (e.g. Work Type Wise -
  // Allowance Fix's per-level grids below), not just the gift threshold.
  // The PATCH route's Zod validator only accepts number/string/boolean
  // values, so a value that isn't one of those must be JSON.stringify'd by
  // the caller before calling setCompanyConfig, and JSON.parse'd back after
  // companyConfig() returns it.
  companyConfig() {
    return request<Record<string, unknown>>("/company/config");
  },

  setCompanyConfig(key: string, value: string | number | boolean) {
    return request<{ key: string; value: string | number | boolean }>(`/company/config/${encodeURIComponent(key)}`, {
      method: "PATCH",
      body: JSON.stringify({ value })
    });
  },

  // ══════════════════════════════════════════════════════════════════════
  // Zivira_Project_Basic.docx — SFA/CRM Analytics + BI Platform
  // The backend for every module below already exists (routes/company.
  // routes.ts /analytics/*); these are purely new, additive read/write
  // wrappers — nothing above this line is touched.
  // ══════════════════════════════════════════════════════════════════════

  // Topic 2 — Attendance & Compliance Analytics / Topic 4 — Chronic Defaulter Detection
  complianceAnalytics(month?: string) {
    return fetchRaw<{ data: ComplianceRow[]; month: string; summary: { submittedToday: number; pendingDCR: number; missedYesterday: number; chronicDefaulters: number; avgCompliancePercent: number } }>(`/company/analytics/compliance${month ? `?month=${month}` : ""}`);
  },

  // Topic 3 — Salary Integration Engine (payroll hold workflow)
  payrollAnalytics(month?: string) {
    return fetchRaw<{ data: PayrollStatusRow[]; month: string; summary: { onHold: number; pendingApproval: number; released: number } }>(`/company/analytics/payroll${month ? `?month=${month}` : ""}`);
  },

  releasePayroll(id: string) {
    return request<PayrollStatusRow>(`/company/analytics/payroll/${id}/release`, { method: "PATCH" });
  },

  // Topic 5 — Representative vs Manager Analysis / Topic 6 — Joint Field Work Analysis
  repManagerAnalysis(month?: string) {
    return fetchRaw<{ data: RepAnalysisRow[]; managers: ManagerJointWorkRow[]; month: string }>(`/company/analytics/rep-manager${month ? `?month=${month}` : ""}`);
  },

  // Topic 7 — Territory Coverage Analytics / Topic 8 — Doctor Exception Management
  // (both riding on the existing /company/doctor-coverage aggregate, which
  // already includes alertBucket / daysSinceLastVisit / exceptionReason)
  territoryCoverage(month?: string) {
    return request<TerritoryCoverageRow[]>(`/company/doctor-coverage${month ? `?month=${month}` : ""}`);
  },

  // Topic 9 — Product Exposure Analytics / Topic 10 — Product-wise Performance Dashboard
  productExposure(month?: string) {
    return request<ProductExposureRow[]>(`/company/analytics/product-exposure${month ? `?month=${month}` : ""}`);
  },

  // Topic 11 — Sample Distribution Analytics
  sampleAllocations(month?: string) {
    return request<SampleAllocationRow[]>(`/company/sample-allocations${month ? `?month=${month}` : ""}`);
  },

  issueSampleAllocation(input: { employeeCode: string; productCode: string; productName: string; batchNumber?: string; qtyIssued: number; month?: string; notes?: string }) {
    return request<SampleAllocationRow>("/company/sample-allocations", { method: "POST", body: JSON.stringify(input) });
  },

  // Topic 11/12 — Sample Distribution + Sample vs Doctor Input Analysis.
  // Backend shape is NOT the standard {data: T[]} envelope — it spreads
  // computeSampleDistribution()'s own {byRep, byProduct, byDoctor, totals}
  // straight onto the response, so this is typed to match exactly.
  sampleDistribution(month?: string) {
    return fetchRaw<SampleDistributionReport>(`/company/analytics/sample-distribution${month ? `?month=${month}` : ""}`);
  },

  // Topic 14 — KPI Engine
  kpiEngine(month?: string) {
    return fetchRaw<{ reps: RepKpi[]; managers: ManagerKpi[]; month: string }>(`/company/analytics/kpi${month ? `?month=${month}` : ""}`);
  },

  // Topic 15 — Alert & Notification Engine
  alertsEngine(month?: string) {
    return fetchRaw<{ data: AlertRow[]; month: string; summary: { high: number; medium: number; low: number } }>(`/company/analytics/alerts${month ? `?month=${month}` : ""}`);
  }
};

// ── Response shapes for the analytics endpoints above. Field names below
// are copied verbatim from the backend's own row types (src/utils/
// compliance.ts, rep-manager-analysis.ts, product-analytics.ts, sample-
// distribution.ts, kpi-engine.ts, alerts-engine.ts) — not guessed — so the
// UI renders exactly what the server computes. Defined locally (rather
// than in @zivira/types, which is shared across every portal) so this
// purely-additive BI layer can never affect any other app's build. ──
export type ComplianceRow = {
  employeeCode: string; employeeName?: string; role?: string;
  submittedToday: boolean; pendingDCR: boolean; missedYesterday: boolean;
  missedThisWeek: number; missedThisMonth: number; expectedThisMonth: number; submittedThisMonth: number;
  compliancePercent: number; missedLast30Days: number; chronicDefaulter: boolean;
  warningLevel: "NONE" | "LOW" | "MEDIUM" | "HIGH"; salaryHold: boolean;
};
export type PayrollStatusRow = {
  id: string; employeeCode: string; employeeName?: string; role?: string; month: string;
  status: "RELEASED" | "HOLD" | "EXPLANATION_SUBMITTED";
  holdReason?: string | null; missedDaysSnapshot?: number;
  employeeExplanation?: string | null; managerApprovedByName?: string | null; releasedAt?: string | null;
};
export type RepAnalysisRow = {
  employeeCode: string; employeeName?: string; reportingManager?: string | null; reportingManagerName?: string;
  doctorsVisited: number; totalVisits: number; jointVisits: number; jointVisitPercent: number;
};
export type ManagerJointWorkRow = {
  managerCode: string; managerName?: string; teamSize: number; totalTeamVisits: number;
  totalJointCalls: number; avgJointCallsPerRep: number; jointCallPercent: number; rank: number;
};
export type TerritoryCoverageRow = DoctorCoverageRow & {
  assignedMRName?: string | null;
  lastVisitDateEver: string | null;
  daysSinceLastVisit: number | null;
  alertBucket: "NEVER_VISITED" | "180" | "90" | "60" | "30" | null;
  exceptionReason?: string | null;
  exceptionNotes?: string | null;
  exceptionMonth?: string | null;
};
export type ProductExposureRow = {
  productCode: string; productName: string; totalSamplesGiven: number; visitsPromoted: number;
  distinctDoctors: number; distinctReps: number; visualAidUsedCount: number;
  topRepCode?: string; topRepName?: string; topRepQty?: number;
  topTerritory?: string; topTerritoryQty?: number;
  topManagerCode?: string; topManagerName?: string; topManagerQty?: number;
  prescriptionInterestHigh: number; prescriptionInterestMedium: number;
  prescriptionInterestLow: number; prescriptionInterestNone: number;
};
export type SampleAllocationRow = {
  id: string; allocationId: string; employeeCode: string; employeeName?: string;
  productCode: string; productName: string; batchNumber?: string | null; qtyIssued: number; month: string;
  issuedBy?: string | null; notes?: string | null; createdAt?: string;
};
export type RepSampleBalanceRow = { employeeCode: string; employeeName?: string; totalIssued: number; totalDistributed: number; totalRemaining: number };
export type DoctorSampleRow = { doctorId: string; doctorName: string; totalSamplesReceived: number };
export type ProductSampleRow = { productCode: string; productName: string; totalIssued: number; totalDistributed: number; totalRemaining: number };
export type SampleDistributionReport = {
  byRep: RepSampleBalanceRow[]; byProduct: ProductSampleRow[]; byDoctor: DoctorSampleRow[];
  totals: { totalIssued: number; totalDistributed: number; totalRemaining: number };
  month: string;
};
export type RepKpi = {
  employeeCode: string; employeeName?: string; doctorsVisited: number; dcrSubmitted: number;
  productsPromoted: number; samplesDistributed: number; conversionRatePercent: number; compliancePercent: number;
};
export type ManagerKpi = {
  managerCode: string; managerName?: string; teamSize: number; jointCallPercent: number;
  teamCompliancePercent: number; doctorCoveragePercent: number; managerEffectivenessScore: number;
};
export type AlertRow = {
  type: "DCR_NOT_SUBMITTED" | "DOCTOR_NOT_VISITED_90_DAYS" | "PRODUCT_NOT_PROMOTED" | "LOW_COVERAGE" | "SAMPLE_STOCK_LOW" | "SALARY_HOLD" | "TERRITORY_INACTIVE";
  severity: "HIGH" | "MEDIUM" | "LOW"; message: string; subjectCode?: string; subjectLabel?: string;
};

async function fetchRaw<T>(path: string): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error?.message ?? "API request failed");
  }
  return payload as T;
}
