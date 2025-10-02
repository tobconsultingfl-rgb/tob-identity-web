import { State } from './base';

// Tenant related types
export interface TenantDto {
  tenantId: string;
  tenantName?: string | null;
  tenantWebsite?: string | null;
  tenantAddress1?: string | null;
  tenantAddress2?: string | null;
  tenantCity?: string | null;
  tenantState: State;
  tenantZip?: string | null;
  tenantPhoneNumber?: string | null;
  tenantFax?: string | null;
  contactFirstName?: string | null;
  contactLastName?: string | null;
  contactPhoneNumber?: string | null;
  contactEmail?: string | null;
  createdDateTime?: string | null;
  createdBy?: string | null;
  updatedDateTime?: string | null;
  isActive: boolean;
}

export interface CreateTenantRequest {
  tenantName: string;
  tenantAddress1: string;
  tenantAddress2?: string;
  tenantCity: string;
  tenantState: State;
  tenantZip: string;
  tenantPhoneNumber: string;
  tenantFax?: string;
  contactFirstName: string;
  contactLastName: string;
  contactMobilePhone: string;
  contactEmail: string;
  password?: string;
}

export interface UpdateTenantRequest {
  tenantName: string;
  tenantAddress1: string;
  tenantAddress2?: string;
  tenantCity: string;
  tenantState: State;
  tenantZip: string;
  tenantPhoneNumber: string;
  tenantFax?: string;
  contactFirstName: string;
  contactLastName: string;
  contactMobilePhone: string;
  contactEmail: string;
}