"use client";

import { use } from "react";
import ContractDetailView from "@/components/Contract/ContractDetailView";

export default function ContractPage({
  params,
}: {
  params: Promise<{ contract_id: string }>;
}) {
  const { contract_id } = use(params);

  return <ContractDetailView contractId={contract_id} />;
}
