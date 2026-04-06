export type Organization = {
  id: number;
  name: string;
  status: string;
  created_at: string;
};

export async function createOrganization(data: {
  name: string;
}): Promise<Organization> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    id: 2,
    name: data.name,
    status: "active",
    created_at: new Date().toISOString(),
  };
}

export async function getOrganizations(): Promise<Organization[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [
    {
      id: 1,
      name: "SupplierPro Solutions",
      status: "active",
      created_at: "2024-01-01",
    },
  ];
}
