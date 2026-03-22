export type Contract = {
  id: string;
  name: string;
  description?: string;
  status: "Active" | "Signed" | "Expired" | "Draft";
  lastActivity: string;
};

export type Invoice = {
  id: string;
  client: string;
  issueDate: string;
  dueDate: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
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
  firstName: string;
  lastName: string;
  phone: string;
  status: "Active" | "Invited" | "Disabled";
};

interface OrganizationClient {
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
