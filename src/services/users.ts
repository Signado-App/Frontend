import { User } from "@/types/types";

export async function getUsers(): Promise<User[]> {
  return [
    {
      id: "1",
      firstName: "Martin",
      lastName: "Novák",
      email: "martin.novak@company.com",
      phone: "+420 777 123 456",
      status: "Active",
    },
    {
      id: "2",
      firstName: "Jana",
      lastName: "Svobodová",
      email: "jana.svobodova@company.com",
      phone: "+420 777 234 567",
      status: "Active",
    },
    {
      id: "3",
      firstName: "Petr",
      lastName: "Dvořák",
      email: "petr.dvorak@company.com",
      phone: "+420 777 345 678",
      status: "Invited",
    },
    {
      id: "4",
      firstName: "Lucie",
      lastName: "Procházková",
      email: "lucie.prochazkova@company.com",
      phone: "+420 777 456 789",
      status: "Disabled",
    },
  ];
}
