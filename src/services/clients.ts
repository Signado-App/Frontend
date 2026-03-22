import { Client } from "@/types/types";

export async function getClients(): Promise<Client[]> {
  return [
    {
      id: "1",
      name: "Acme Corporation",
      status: "Active",
      contractsCount: 5,
      totalValue: "$150,000",
    },
    {
      id: "2",
      name: "Globex Inc.",
      status: "Signed",
      contractsCount: 2,
      totalValue: "$50,000",
    },
    {
      id: "3",
      name: "Soylent Corp.",
      status: "Expired",
      contractsCount: 3,
      totalValue: "$75,000",
    },
    {
      id: "4",
      name: "Initech",
      status: "Draft",
      contractsCount: 1,
      totalValue: "$10,000",
    },
  ];
}
