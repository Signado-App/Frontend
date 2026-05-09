import { User } from "@/types/types";

export async function getUsers(): Promise<User[]> {
  return [
    {
      id: "1",
      first_name: "Martin",
      last_name: "Novák",
      email: "martin.novak@company.com",
      phone: "+420 777 123 456",
      status: "Active",
    },
    {
      id: "2",
      first_name: "Jana",
      last_name: "Svobodová",
      email: "jana.svobodova@company.com",
      phone: "+420 777 234 567",
      status: "Active",
    },
    {
      id: "3",
      first_name: "Petr",
      last_name: "Dvořák",
      email: "petr.dvorak@company.com",
      phone: "+420 777 345 678",
      status: "Invited",
    },
    {
      id: "4",
      first_name: "Lucie",
      last_name: "Procházková",
      email: "lucie.prochazkova@company.com",
      phone: "+420 777 456 789",
      status: "Disabled",
    },
  ];
}
