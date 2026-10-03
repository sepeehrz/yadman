export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number | null;
  color: string;
  plateNumber: string;
  vin: string | null;
  fuelType: string;
  odometerKm: number;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleInput {
  name: string;
  brand?: string;
  model?: string;
  year?: number | null;
  color: string;
  plateNumber: string;
  vin?: string;
  fuelType?: string;
  odometerKm?: number;
  imageUrl?: string;
}

export type UpdateVehicleInput = Partial<CreateVehicleInput>;

export interface ServiceCategory {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  defaultIntervalKm: number | null;
  defaultIntervalMonths: number | null;
}

export interface VehicleService {
  id: string;
  vehicleId: string | null;
  categoryId: string | null;
  title: string;
  serviceDate: string;
  provider: string;
  odometerKm: number;
  cost: number;
  receiptVerified: boolean;
  notes: string | null;
  category: string;
  nextDueDate: string | null;
  nextDueKm: number | null;
  createdAt: string;
}

export interface CreateServiceInput {
  title: string;
  categoryId?: string | null;
  serviceDate: string;
  provider?: string;
  odometerKm: number;
  cost?: number;
  notes?: string;
  nextDueDate?: string;
  nextDueKm?: number | null;
}

export type UpdateServiceInput = Partial<CreateServiceInput>;

export type InsuranceType = "third-party" | "body";

export interface Insurance {
  id: string;
  vehicleId: string;
  type: InsuranceType;
  company: string;
  policyNumber: string | null;
  startDate: string;
  endDate: string;
  cost: number | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateInsuranceInput {
  type: InsuranceType;
  company: string;
  policyNumber?: string;
  startDate: string;
  endDate: string;
  cost?: number | null;
  notes?: string;
}

export type UpdateInsuranceInput = Partial<CreateInsuranceInput>;

export interface Toll {
  id: string;
  vehicleId: string;
  year: string;
  amount: number;
  paid: boolean;
  paidAt: string | null;
  dueDate: string | null;
  notes: string | null;
  createdAt: string;
}

export interface CreateTollInput {
  year: string;
  amount: number;
  dueDate?: string;
  notes?: string;
}

export interface UpdateTollInput {
  year?: string;
  amount?: number;
  paid?: boolean;
  paidAt?: string | null;
  dueDate?: string;
  notes?: string;
}

export type ExpiringKind = "insurance" | "toll" | "service";

export type ReminderSeverity = "overdue" | "urgent" | "soon" | "ok";

export interface ExpiringReminder {
  kind: ExpiringKind;
  refId: string;
  vehicleId: string;
  vehicleName: string;
  title: string;
  detail: string;
  dueDate: string | null;
  dueKm: number | null;
  daysRemaining: number | null;
  severity: ReminderSeverity;
}
