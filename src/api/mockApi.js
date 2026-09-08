const API_DELAY = 220;
const STORAGE_KEYS = {
  projects: 'northstar_projects',
  users: 'northstar_users',
  tenants: 'northstar_tenants',
  audit: 'northstar_audit',
};

const seedUsers = [
  {
    id: 'u1',
    name: 'Aarav Mehta',
    email: 'aarav@northstar.io',
    role: 'super_admin',
    department: 'Platform',
    status: 'Active',
    lastActive: '2 min ago',
    tenantId: 'platform',
  },
  {
    id: 'u2',
    name: 'Maya Shah',
    email: 'maya@acme.io',
    role: 'admin',
    department: 'Operations',
    status: 'Active',
    lastActive: '14 min ago',
    tenantId: 't1',
  },
  {
    id: 'u3',
    name: 'Kabir Rao',
    email: 'kabir@acme.io',
    role: 'user',
    department: 'Sales',
    status: 'Active',
    lastActive: '1 hr ago',
    tenantId: 't1',
  },
  {
    id: 'u4',
    name: 'Sara Iyer',
    email: 'sara@acme.io',
    role: 'user',
    department: 'Finance',
    status: 'Invited',
    lastActive: 'Never',
    tenantId: 't1',
  },
  {
    id: 'u5',
    name: 'Dev Malhotra',
    email: 'dev@globex.io',
    role: 'manager',
    department: 'Product',
    status: 'Active',
    lastActive: '3 hrs ago',
    tenantId: 't2',
  },
  {
    id: 'u6',
    name: 'Anika Jain',
    email: 'anika@globex.io',
    role: 'user',
    department: 'Marketing',
    status: 'Active',
    lastActive: '5 hrs ago',
    tenantId: 't2',
  },
  {
    id: 'u7',
    name: 'Rohan Kapoor',
    email: 'rohan@initech.io',
    role: 'admin',
    department: 'Technology',
    status: 'Active',
    lastActive: '28 min ago',
    tenantId: 't3',
  },
];

const seedProjects = [
  {
    id: 'p1',
    name: 'Customer Portal Refresh',
    owner: 'Maya Shah',
    department: 'Operations',
    progress: 82,
    status: 'On track',
    budget: '₹18.4L',
    updated: 'Today',
    tenantId: 't1',
  },
  {
    id: 'p2',
    name: 'Q4 Revenue Console',
    owner: 'Dev Malhotra',
    department: 'Product',
    progress: 61,
    status: 'At risk',
    budget: '₹24.8L',
    updated: 'Yesterday',
    tenantId: 't2',
  },
  {
    id: 'p3',
    name: 'Sales Enablement Hub',
    owner: 'Kabir Rao',
    department: 'Sales',
    progress: 100,
    status: 'Complete',
    budget: '₹8.9L',
    updated: 'Aug 31',
    tenantId: 't1',
  },
  {
    id: 'p4',
    name: 'Finance Workflow v2',
    owner: 'Sara Iyer',
    department: 'Finance',
    progress: 44,
    status: 'On track',
    budget: '₹11.2L',
    updated: 'Aug 29',
    tenantId: 't1',
  },
  {
    id: 'p5',
    name: 'Brand Intelligence',
    owner: 'Anika Jain',
    department: 'Marketing',
    progress: 27,
    status: 'At risk',
    budget: '₹6.7L',
    updated: 'Aug 27',
    tenantId: 't2',
  },
  {
    id: 'p6',
    name: 'Retail Demand AI',
    owner: 'Rohan Kapoor',
    department: 'Technology',
    progress: 73,
    status: 'On track',
    budget: '₹31.0L',
    updated: 'Today',
    tenantId: 't3',
  },
];

const seedTenants = [
  {
    id: 't1',
    name: 'Acme Corporation',
    plan: 'Enterprise',
    status: 'Active',
    members: 84,
    projects: 26,
    mrr: '₹14.8L',
    region: 'Mumbai',
    created: 'Jan 08, 2024',
  },
  {
    id: 't2',
    name: 'Globex Industries',
    plan: 'Growth',
    status: 'Active',
    members: 42,
    projects: 13,
    mrr: '₹6.4L',
    region: 'Bengaluru',
    created: 'Apr 19, 2024',
  },
  {
    id: 't3',
    name: 'Initech Labs',
    plan: 'Starter',
    status: 'Trial',
    members: 18,
    projects: 7,
    mrr: '₹1.9L',
    region: 'Pune',
    created: 'Aug 02, 2026',
  },
  {
    id: 't4',
    name: 'Umbrella Retail',
    plan: 'Enterprise',
    status: 'Suspended',
    members: 126,
    projects: 41,
    mrr: '₹22.5L',
    region: 'Delhi',
    created: 'Oct 14, 2023',
  },
];

const seedAudit = [
  {
    id: 'a1',
    actor: 'Aarav Mehta',
    action: 'Updated tenant plan',
    target: 'Acme Corporation → Enterprise',
    when: '8 min ago',
    severity: 'Medium',
    tenantId: 't1',
  },
  {
    id: 'a2',
    actor: 'Maya Shah',
    action: 'Created project',
    target: 'Customer Portal Refresh',
    when: '42 min ago',
    severity: 'Low',
    tenantId: 't1',
  },
  {
    id: 'a3',
    actor: 'Aarav Mehta',
    action: 'Suspended tenant',
    target: 'Umbrella Retail',
    when: '3 hrs ago',
    severity: 'High',
    tenantId: 't4',
  },
  {
    id: 'a4',
    actor: 'Dev Malhotra',
    action: 'Updated project',
    target: 'Q4 Revenue Console',
    when: '5 hrs ago',
    severity: 'Low',
    tenantId: 't2',
  },
];

function wait(ms = API_DELAY) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readCollection(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeCollection(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function encode(value) {
  return btoa(unescape(encodeURIComponent(value)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function decode(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return decodeURIComponent(escape(atob(padded)));
}

function createToken(user) {
  const header = encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = encode(
    JSON.stringify({
      sub: user.id,
      role: user.role,
      tenantId: user.tenantId,
      exp: Date.now() + 1000 * 60 * 60 * 2,
    }),
  );
  return `${header}.${payload}.demo-signature`;
}

function readToken(token) {
  try {
    return JSON.parse(decode(token.split('.')[1]));
  } catch {
    return null;
  }
}

const demoUsers = () => readCollection(STORAGE_KEYS.users, seedUsers);
const demoProjects = () => readCollection(STORAGE_KEYS.projects, seedProjects);
const demoTenants = () => readCollection(STORAGE_KEYS.tenants, seedTenants);
const demoAudit = () => readCollection(STORAGE_KEYS.audit, seedAudit);

export const mockApi = {
  async login({ email, password, role }) {
    await wait();
    if (password.trim().length < 4) {
      throw new Error('Use a password with at least 4 characters.');
    }

    const users = demoUsers();
    const user = users.find((item) => item.role === role && item.email.toLowerCase() === email.trim().toLowerCase());
    const fallback = users.find((item) => item.role === role);

    if (!user && !fallback) {
      throw new Error('Demo user not found.');
    }

    const selectedUser = user || fallback;
    return { token: createToken(selectedUser), user: selectedUser };
  },

  async getCurrentUser(token) {
    await wait(100);
    const payload = readToken(token);
    if (!payload || payload.exp < Date.now()) {
      throw new Error('SESSION_EXPIRED');
    }

    const user = demoUsers().find((item) => item.id === payload.sub);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    return user;
  },

  async getProjects(tenantId) {
    await wait(120);
    return demoProjects().filter((item) => item.tenantId === tenantId);
  },

  async saveProject(project) {
    await wait(160);
    const projects = demoProjects();
    const index = projects.findIndex((item) => item.id === project.id);
    if (index === -1) {
      projects.unshift(project);
    } else {
      projects[index] = project;
    }
    writeCollection(STORAGE_KEYS.projects, projects);
    return project;
  },

  async getUsers(tenantId) {
    await wait(120);
    return demoUsers().filter((item) => item.tenantId === tenantId);
  },

  async saveUser(user) {
    await wait(160);
    const users = demoUsers();
    const index = users.findIndex((item) => item.id === user.id);
    if (index === -1) {
      users.unshift(user);
    } else {
      users[index] = user;
    }
    writeCollection(STORAGE_KEYS.users, users);
    return user;
  },

  async getAudit(tenantId) {
    await wait(100);
    const audit = demoAudit();
    return tenantId ? audit.filter((item) => item.tenantId === tenantId) : audit;
  },

  async getTenants() {
    await wait(140);
    return demoTenants();
  },

  async saveTenant(tenant) {
    await wait(170);
    const tenants = demoTenants();
    const index = tenants.findIndex((item) => item.id === tenant.id);
    if (index >= 0) {
      tenants[index] = tenant;
      writeCollection(STORAGE_KEYS.tenants, tenants);
    }
    return tenant;
  },

  async getPlatformMetrics() {
    await wait(100);
    const tenants = demoTenants();
    return {
      tenants: tenants.length,
      activeTenants: tenants.filter((item) => item.status === 'Active').length,
      mrr: '₹45.6L',
      uptime: '99.995%',
      incidents: 2,
    };
  },

  async addAudit(entry) {
    const audit = demoAudit();
    const item = {
      ...entry,
      id: `a${Date.now()}`,
      when: 'just now',
    };
    audit.unshift(item);
    writeCollection(STORAGE_KEYS.audit, audit);
    return item;
  },
};
