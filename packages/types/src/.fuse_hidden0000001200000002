export * from "./zivira-tree";

export type PortalKind = "SUPER_ADMIN" | "COMPANY_ADMIN" | "FIELD_FORCE";

export type TenantStatus = "SETUP" | "SANDBOX" | "PILOT" | "LIVE" | "SUSPENDED";

export type SubscriptionPlan = "SANDBOX" | "GROWTH" | "ENTERPRISE";

export type Tenant = {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  subscriptionPlan: SubscriptionPlan;
  licenseLimit: number;
  activeUsers: number;
  enabledModuleKeys: string[];
  storageUsedMb: number;
  createdAt: string;
  updatedAt: string;
};

export type PlatformModule = {
  id: string;
  key: string;
  name: string;
  description: string;
  category: "CORE" | "FIELD" | "AI" | "REPORTING" | "ADMIN" | "COMPLIANCE";
  defaultEnabled: boolean;
  featureKeys: string[];
  createdAt: string;
  updatedAt: string;
};

export type FeatureFlag = {
  id: string;
  key: string;
  name: string;
  description: string;
  enabledGlobally: boolean;
  enabledTenantSlugs: string[];
  rolloutStage: "INTERNAL" | "BETA" | "GA" | "PAUSED";
  createdAt: string;
  updatedAt: string;
};

export type AuthUser = {
  id: string;
  username: string;
  displayName: string;
  role: "SUPER_ADMIN" | "COMPANY_ADMIN" | "NBH" | "ABM" | "MR";
  tenantSlug?: string;
  portal: PortalKind;
};

export type Employee = {
  id: string;
  tenantSlug: string;
  name: string;
  employeeCode: string;
  designation: string;
  division: string;
  reportingManager?: string;
  territory: string;
  role: "NBH" | "BH" | "RBM" | "ZBM" | "ABM" | "SR_MR" | "MR" | "OTHER";
  status: "ACTIVE" | "INACTIVE";
  dob?: string | null;
  email?: string | null;
  phone?: string | null;
  joinDate?: string | null;
  address1?: string | null;
  landmark?: string | null;
  location?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  l1Division?: string | null;
  l1Role?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Doctor = {
  id: string;
  tenantSlug: string;
  name: string;
  specialty: string;
  category: "A" | "B" | "C" | "D";
  state: string;
  city: string;
  territory: string;
  mappedEmployeeCode?: string;
  mappedEmployeeName?: string | null;
  doctorCode?: string | null;
  dob?: string | null;
  anniversaryDate?: string | null;
  gender?: string | null;
  registrationNo?: string | null;
  maritalStatus?: string | null;
  qualification?: string | null;
  specialityCode?: string | null;
  categoryCode?: string | null;
  address1?: string | null;
  location?: string | null;
  country?: string | null;
  postalCode?: string | null;
  clinicName?: string | null;
  phone?: string | null;
  email?: string | null;
  grade?: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  tenantSlug: string;
  name: string;
  code: string;
  category: string;
  division: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

export type Dcr = {
  id: string;
  tenantSlug: string;
  employeeCode: string;
  doctorId?: string | Doctor;
  visitDate: string;
  productsDetailed: string[];
  notes?: string;
  status: "DRAFT" | "SUBMITTED" | "MANAGER_APPROVED" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
};

export type Attendance = {
  id: string;
  tenantSlug: string;
  employeeCode: string;
  attendanceDate: string;
  status: "PRESENT" | "ABSENT" | "LEAVE";
  checkInAt?: string;
  checkOutAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type CompanyDashboard = {
  metrics: {
    employeeCount: number;
    doctorCount: number;
    activeProductCount: number;
    dcrSubmittedToday: number;
    attendanceMarkedToday: number;
  };
  recentDoctors: Doctor[];
  recentEmployees: Employee[];
};

export type FieldDashboard = {
  profile: Employee;
  today: {
    plannedVisits: number;
    completedDcrs: number;
    attendanceMarked: boolean;
  };
  doctors: Doctor[];
  recentDcrs: Dcr[];
};

export type ApiEnvelope<T> = {
  data: T;
};

// PRD 12.3A — productCode/batchNumber added; product picker only, no free text.
export type SampleGiven = { productName: string; productCode?: string; qty: number; batchNumber?: string };
// PRD 12.3B — itemType/valueRs added; itemType feeds the MCI gift-value compliance alert.
export type InputGiven = { inputName: string; itemType?: string; qty: number; valueRs?: number };

export type JointWork = {
  accompanyingManager?: string;
  jointWorkType?: "FIELD_WORK" | "ON_JOB_TRAINING" | "PERFORMANCE_REVIEW";
  managerObservations?: string;
};

export type DcrExtended = Dcr & {
  callSession?: "MORNING" | "AFTERNOON" | "EVENING";
  callTime?: string;
  samplesGiven?: SampleGiven[];
  inputsGiven?: InputGiven[];
  jointWork?: JointWork;
  managerApprovedBy?: string;
  managerApprovedAt?: string;
  adminVisibleAt?: string;
  overVisitFlag?: boolean;
  overVisitCount?: number | null;
};

export type ManagerDashboard = {
  manager: Employee;
  team: Employee[];
  stats: { totalDcrs: number; pendingApproval: number; approvedToday: number; teamSize: number };
};

// ── PRD 12.5 — GST Multi-Branch ─────────────────────────────────────────
export type CompanyBranch = {
  id: string;
  tenantSlug: string;
  branchName: string;
  gstNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isHeadquarters: boolean;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};

// ── PRD 12.1 — Tour Plan (cross-manager void/reassign) ──────────────────
export type TourPlanLocation = { date: string; area: string; town: string; purpose?: string };
export type TourPlanStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "VOIDED";

export type TourPlan = {
  id: string;
  tenantSlug: string;
  tpId: string;
  employeeCode: string;
  employeeName?: string;
  primaryManager: string;
  assignedManager: string;
  month: string;
  locations: TourPlanLocation[];
  status: TourPlanStatus;
  rejectReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  voidedBy?: string;
  voidedAt?: string;
  voidReason?: string;
  reassignedToTpId?: string;
  parentTpId?: string;
  gstBranchCode?: string;
  gstBranchName?: string;
  createdAt: string;
  updatedAt: string;
};

// ── PRD 12.2/12.3 — Doctor Coverage MIS ─────────────────────────────────
export type DoctorCoverageRow = {
  doctorId: string;
  doctorName: string;
  specialty?: string;
  assignedMR: string | null;
  totalVisits: number;
  lastVisitDate: string | null;
  totalSamples: number;
  totalGifts: number;
  totalGiftValueRs: number;
  overGiftThreshold: boolean;
};
