import { Contract } from "@/types/types";

export async function getContracts(): Promise<Contract[]> {
  return [
    {
      id: "1",
      name: "Software Agreement",
      status: "Active",
      lastActivity: "Dec 20, 2024",
    },
    {
      id: "2",
      name: "Consulting Contract",
      status: "Signed",
      lastActivity: "Dec 15, 2024",
    },
    {
      id: "3",
      name: "NDA Agreement",
      status: "Expired",
      lastActivity: "Nov 30, 2024",
    },
    {
      id: "4",
      name: "Service Level Agreement",
      status: "Draft",
      lastActivity: "Dec 18, 2024",
    },
  ];
}
