import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { mockApi } from '../api/mockApi';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [audit, setAudit] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [metrics, setMetrics] = useState(null);

  const loadProjects = useCallback(async (tenantId) => {
    const result = await mockApi.getProjects(tenantId);
    setProjects(result);
    return result;
  }, []);

  const saveProject = useCallback(async (project) => {
    const result = await mockApi.saveProject(project);
    setProjects((current) => {
      const exists = current.some((item) => item.id === result.id);
      return exists ? current.map((item) => (item.id === result.id ? result : item)) : [result, ...current];
    });
    return result;
  }, []);

  const loadUsers = useCallback(async (tenantId) => {
    const result = await mockApi.getUsers(tenantId);
    setUsers(result);
    return result;
  }, []);

  const saveUser = useCallback(async (user) => {
    const result = await mockApi.saveUser(user);
    setUsers((current) => {
      const exists = current.some((item) => item.id === result.id);
      return exists ? current.map((item) => (item.id === result.id ? result : item)) : [result, ...current];
    });
    return result;
  }, []);

  const loadAudit = useCallback(async (tenantId) => {
    const result = await mockApi.getAudit(tenantId);
    setAudit(result);
    return result;
  }, []);

  const addAudit = useCallback(async (entry) => {
    const result = await mockApi.addAudit(entry);
    setAudit((current) => [result, ...current]);
    return result;
  }, []);

  const loadTenants = useCallback(async () => {
    const result = await mockApi.getTenants();
    setTenants(result);
    return result;
  }, []);

  const saveTenant = useCallback(async (tenant) => {
    const result = await mockApi.saveTenant(tenant);
    setTenants((current) => current.map((item) => (item.id === result.id ? result : item)));
    return result;
  }, []);

  const loadMetrics = useCallback(async () => {
    const result = await mockApi.getPlatformMetrics();
    setMetrics(result);
    return result;
  }, []);

  const value = useMemo(
    () => ({
      projects,
      users,
      audit,
      tenants,
      metrics,
      loadProjects,
      saveProject,
      loadUsers,
      saveUser,
      loadAudit,
      addAudit,
      loadTenants,
      saveTenant,
      loadMetrics,
    }),
    [projects, users, audit, tenants, metrics, loadProjects, saveProject, loadUsers, saveUser, loadAudit, addAudit, loadTenants, saveTenant, loadMetrics],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used inside DataProvider');
  }
  return context;
}
