export interface Tenant {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
}

export interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
  fetchTenant: () => Promise<void>;
}