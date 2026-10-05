"use client";

import { createContext, useContext, useState } from "react";
import { Privilege } from "@/types/types";

import { Privileges } from "@/constants/privileges";

type PrivilegesContextType = {
  privileges: Privilege[];
  hasPrivilege: (privilege: Privilege) => boolean;
  loadPrivileges: (privileges: Privilege[]) => void;
};

const PrivilegesContext = createContext<PrivilegesContextType>({
  privileges: [],
  hasPrivilege: () => false,
  loadPrivileges: () => {},
});

export function PrivilegesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [privileges, setPrivileges] = useState<Privilege[]>([]);

  const hasPrivilege = (privilege: Privilege) => {
    // Organization administrators have all privileges
    if (
      privileges.includes(Privileges.ADMIN_BASIC) ||
      privileges.includes(Privileges.ADMIN_UPDATE) ||
      privileges.includes(Privileges.ADMIN_DELETE)
    ) {
      return true;
    }
    return privileges.includes(privilege);
  };
  const loadPrivileges = (privileges: Privilege[]) => setPrivileges(privileges);

  return (
    <PrivilegesContext.Provider
      value={{ privileges, hasPrivilege, loadPrivileges }}
    >
      {children}
    </PrivilegesContext.Provider>
  );
}

export const usePrivileges = () => useContext(PrivilegesContext);
