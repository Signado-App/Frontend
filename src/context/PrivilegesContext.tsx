"use client";

import { createContext, useContext, useState } from "react";
import { Privilege } from "@/types/types";

type PrivilegesContextType = {
  privileges: Privilege[];
  hasPrivilege: (privilege: Privilege) => boolean;
};

const PrivilegesContext = createContext<PrivilegesContextType>({
  privileges: [],
  hasPrivilege: () => false,
});

export function PrivilegesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // mock
  const [privileges] = useState<Privilege[]>([
    "view_contracts",
    "manage_contracts",
    "manage_groups",
    "manage_clients",
  ]);

  const hasPrivilege = (privilege: Privilege) => privileges.includes(privilege);

  return (
    <PrivilegesContext.Provider value={{ privileges, hasPrivilege }}>
      {children}
    </PrivilegesContext.Provider>
  );
}

export const usePrivileges = () => useContext(PrivilegesContext);
