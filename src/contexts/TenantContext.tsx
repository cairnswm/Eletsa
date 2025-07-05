import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, TenantContextType } from '../types/tenant';
import { api } from '../services/api';

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenant = async () => {
    try {
      setLoading(true);
      setError(null);
      const tenantData = await api.getTenant();
      setTenant(tenantData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tenant');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, []);

  const value: TenantContextType = {
    tenant,
    loading,
    error,
    fetchTenant,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};