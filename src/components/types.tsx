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