import { Privileges } from "@/constants/privileges";

export type Mode = "client" | "organization";

export type RegisterData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export type OrganizationListItem = {
  organization_id: number;
  name: string;
  role_status: string;
  joined_at: string;
};

export type OrganizationInfo = {
  organization_id: number;
  organization_name: string;
  joined_at: string;
  privileges: { id: string; name: string; description: string }[];
  groups: any[];
  status: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  data: {
    access_csrf: string;
    refresh_csrf: string;
  };
  status: string;
  specification: string;
};

export type ApiResponse = {
  status: string;
  specification: string;
};

export type RegisterResponse = {
  status: string;
  specification: string;
};

export type PageItem = {
  href: string;
  icon: React.ReactNode;
  primary: string;
  secondary: string;
  modes: Mode[];
  privilege?: Privilege;
};

export type Contract = {
  id: string;
  name: string;
  description?: string;
  status: "Active" | "Signed" | "Expired" | "Draft";
  lastActivity: string;
};

export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type Invoice = {
  id: string;
  client: string;
  issueDate: string;
  dueDate: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
};

export type Privilege = (typeof Privileges)[keyof typeof Privileges];

export type GroupPrivilege = {
  id: string;
  privilegeId: string;
  name: Privilege;
  description: string;
  grantedAt: string;
  grantedById: string;
  expiresAt: string | null;
};
export type Client = {
  id: string;
  name: string;
  status: "Active" | "Signed" | "Expired" | "Draft";
  contractsCount: number;
  totalValue: string;
};

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: "Active" | "Invited" | "Disabled";
};

export interface DBUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  two_factor_enabled: boolean;
  created_at: string;
}

export interface DBGroup {
  id: number;
  name: string;
  description: string;
  organization_id: number;
  created_by_id: number;
}

export interface DBOrganizationClient {
  id: number;
  organization_id: number;
  user_id: number;
  status: string;
  client_metadata: Record<string, unknown>;
  created_at: string;
  created_by_id: number;
}

interface DBContract {
  id: number;
  title: string;
  description: string;
  status: string;
  expires_at: string;
  created_at: string;
  deleted_at: string | null;
  created_by_user_id: number;
  organization_id: number;
  creator_member_id: number;
}

export type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (accessCsrf: string, refreshCsrf: string) => void;
  logout: () => void;
  refresh: () => Promise<void>;
  organizations: OrganizationListItem[];
  refreshOrganizations: () => Promise<void>;
};

export type ApiErrorShape = {
  type: "NETWORK_ERROR" | "UNAUTHORIZED" | "SERVER_ERROR" | "API_ERROR";
  status: number | null;
  message: string;
  data: unknown;
};

export type OrgMember = {
  member_id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  joined_at: string | null;
};

export type OrgClient = {
  id: number;
  user_id: number;
  client_name: string;
  status: string;
  created_at: string | null;
  client_metadata: Record<string, unknown> | null;
};

export type OrgClientDetail = {
  id: number;
  user_id: number;
  client_name: string;
  status: string;
  client_metadata: Record<string, unknown> | null;
  created_at: string | null;
  user_details: {
    email: string | null;
    first_name: string | null;
    last_name: string | null;
  };
};

export type OrgContract = {
  id: string;
  title: string;
  status: string;
  created_at: string | null;
  expires_at: string | null;
  description: string | null;
  last_activity: string | null;
};

// types.ts
export type OrgContractDetail = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  min_verification: string;
  sign_by: string | null;
  copy_recipients: string[];
  category: string[];
  reminders: any;
  use_order_send: boolean;
  group_id: number | null;
  created_at: string | null;
  expires_at: string | null;
  last_activity: string | null;
  parties: {
    user_id: number;
    email: string | null;
    role: string;
    status: string;
  }[];
  files: {
    file_id: string;
    name: string;
    file_type: string;
    size_bytes: number;
    download_url: string;
  }[];
  events: {
    event_type: string;
    event_metadata: any;
    timestamp: string | null;
  }[];
};

export type OrgGroup = {
  id: number;
  name: string;
  member_count: number;
  privileges: { id: number; name: string; description: string }[];
};

export type GroupMemberItem = {
  organization_member_id: number;
  added_at: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
};

export type FieldType = "signature" | "text";

export type PlacedField = {
  x: number | undefined;
  y: number | undefined;
  width: number | undefined;
  height: number | undefined;
  id: string;
  type: FieldType;
  page: number; 
  xRatio: number;
  yRatio: number;
  widthRatio: number;
  heightRatio: number;
  partyKey: string; 
  label?: string; 
};
