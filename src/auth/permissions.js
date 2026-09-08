export const roles = {
  super_admin: {
    label: 'Super Admin',
    description: 'Platform administration',
  },
  admin: {
    label: 'Administrator',
    description: 'Full workspace access',
  },
  manager: {
    label: 'Manager',
    description: 'Projects and team access',
  },
  user: {
    label: 'Standard User',
    description: 'Standard workspace access',
  },
};

export const rolePermissions = {
  super_admin: [
    'workspace.read',
    'workspace.manage',
    'projects.read',
    'projects.manage',
    'team.read',
    'team.manage',
    'audit.read',
    'reports.read',
    'settings.manage',
    'platform.manage',
  ],
  admin: [
    'workspace.read',
    'workspace.manage',
    'projects.read',
    'projects.manage',
    'team.read',
    'team.manage',
    'audit.read',
    'reports.read',
    'settings.manage',
  ],
  manager: [
    'workspace.read',
    'projects.read',
    'projects.manage',
    'team.read',
    'reports.read',
    'settings.manage',
  ],
  user: [
    'workspace.read',
    'projects.read',
    'reports.read',
    'settings.manage',
  ],
};

export function hasPermission(role, permission) {
  return rolePermissions[role]?.includes(permission) || false;
}
