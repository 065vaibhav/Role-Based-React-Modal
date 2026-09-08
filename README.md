# Northstar RBAC Demo

A React client demo for role-based access control, protected routing and a small mock API.

## Stack

- React 18
- React Router
- Vite
- JavaScript / JSX
- Lucide React
- React Context for shared auth and workspace data

There is no TypeScript or Redux in this version. They can be introduced later without changing the main user flows.

## What is implemented

### Authentication

- Demo login screen with role selection
- JWT-shaped token stored in localStorage
- Session restore on page refresh
- Two-hour token expiry check
- Logout and protected routes

### Role based access

| Role | Access |
| --- | --- |
| Super Admin | Platform control + tenant workspace |
| Administrator | Full tenant workspace |
| Manager | Projects, team read access, reports |
| Standard User | Workspace read access + reports |

The same permission map controls both navigation visibility and protected routes.

### Workspace

- Dashboard
- Project search and filtering
- Create / edit project modal
- Team member list
- Invite / edit member modal for administrators
- Reports
- Tenant audit log
- Security settings

### Super Admin

- Tenant portfolio
- Tenant status / plan update
- Platform metrics
- Platform health panel
- Platform audit entries

## Project structure

```text
src/
  api/
    mockApi.js
  auth/
    permissions.js
  components/
    Kpi.jsx
    Layout.jsx
    Modal.jsx
    PageHeader.jsx
  context/
    AuthContext.jsx
    DataContext.jsx
  pages/
    Audit.jsx
    Dashboard.jsx
    Login.jsx
    NotFound.jsx
    Projects.jsx
    Reports.jsx
    Settings.jsx
    SuperAdmin.jsx
    Team.jsx
  App.jsx
  main.jsx
  styles.css
```

## Demo accounts

Use `password` as the password. The role selector can also fall back to a user in that role.

- Super Admin: `aarav@northstar.io`
- Administrator: `maya@acme.io`
- Manager: `dev@globex.io`
- Standard User: `kabir@acme.io`

## Run

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
```

The API is intentionally mocked. Project, user, tenant and audit changes are persisted in localStorage so a client demo survives a refresh.
