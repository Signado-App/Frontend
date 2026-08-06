import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/SnackbarContext";
import { useUserContext } from "@/context/UserContext";
import { OrgClient, PlacedField } from "@/types/types";
import { getOrgClients } from "@/services/orgClients";
import { completeContract, createOrgContract } from "@/services/orgContracts";
import { embedFieldsIntoPdf } from "@/utils/pdfFields";
import { sha256 } from "js-sha256";
import { useAuthContext } from "@/context/AuthContext";

async function computeFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashHex = sha256(buffer);

  const bytes = new Uint8Array(hashHex.length / 2);
  for (let i = 0; i < hashHex.length; i += 2) {
    bytes[i / 2] = parseInt(hashHex.substring(i, i + 2), 16);
  }
  return btoa(String.fromCharCode(...bytes));
}

export type SubmitStage =
  | "idle"
  | "creating"
  | "uploading"
  | "finalizing"
  | "done";

export function useCreateContractForm() {
  const router = useRouter();
  const [error, setError] = React.useState<string | null>(null);
  const { showSnackbar } = useSnackbar();
  const { selectedOrgId } = useUserContext();
  const [activeStep, setActiveStep] = useState(0);
  const { user } = useAuthContext();

  // Step 1: Details
  const [form, setForm] = React.useState({
    title: "",
    description: "",
    expires_at: "",
  });
  const isTitleValid = form.title.trim().length > 0;
  const isExpiresAtValid = form.expires_at.trim().length > 0;
  const isDetailsValid = isTitleValid && isExpiresAtValid;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Step 2: Parties
  const [parties, setParties] = useState<
    { user_id: number | null; email: string; role: string }[]
  >([]);
  const [partyEmail, setPartyEmail] = useState("");
  const [orgClients, setOrgClients] = useState<OrgClient[]>([]);
  const isPartiesValid = parties.length > 0;

  const addParty = () => {
    if (!partyEmail) return;
    setParties((prev) => [
      ...prev,
      { user_id: null, email: partyEmail, role: "SIGNER" },
    ]);
    setPartyEmail("");
  };

  const addPartyFromClient = (client: OrgClient) => {
    if (parties.some((p) => p.user_id === client.user_id)) return;
    setParties((prev) => [
      ...prev,
      { user_id: client.user_id, email: client.client_name, role: "SIGNER" },
    ]);
  };

  const addMyself = () => {
    if (!user) return;
    if (parties.some((p) => p.user_id === Number(user.id))) return;
    setParties((prev) => [
      ...prev,
      { user_id: Number(user.id), email: user.email, role: "SIGNER" },
    ]);
  };

  const removeParty = (index: number) => {
    setParties((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!selectedOrgId) return;
    getOrgClients(selectedOrgId)
      .then((response) => setOrgClients(response.clients))
      .catch(() => setOrgClients([]));
  }, [selectedOrgId]);

  // Step 3: Files
  const [files, setFiles] = useState<File[]>([]);
  const [placedFields, setPlacedFields] = useState<PlacedField[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (index === 0) setPlacedFields([]);
  };

  // Step 4: Review + submit
  const [submitStage, setSubmitStage] = useState<SubmitStage>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const loading = submitStage !== "idle" && submitStage !== "done";

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => Math.max(0, prev - 1));
  const goToStep = (step: number) => setActiveStep(step);

  const handleSubmit = async () => {
    if (!selectedOrgId) return;
    setSubmitError(null);

    let contractId: string | null = null;
    let stage: SubmitStage = "creating";

    try {
      stage = "creating";
      setSubmitStage("creating");

      // 1. vlož podpisová a textová pole do PDF
      const preparedFiles = await Promise.all(
        files.map(async (file, index) => {
          if (file.type !== "application/pdf") return file;
          // pole se zatím umisťují jen do prvního PDF
          if (index !== 0) return file;
          return embedFieldsIntoPdf(file, placedFields);
        }),
      );

      console.log("[Submit] placedFields:", placedFields.length, placedFields);
      console.log("[Submit] původní velikost:", files[0]?.size);
      console.log("[Submit] po vložení polí:", preparedFiles[0]?.size);

      // 2. hash se počítá až z upravených souborů
      const filesData = await Promise.all(
        preparedFiles.map(async (file) => ({
          name: file.name,
          size: file.size,
          type: file.type,
          hash: await computeFileHash(file),
        })),
      );

      const payload = {
        title: form.title,
        description: form.description,
        expires_at: new Date(form.expires_at).toISOString(),
        sign_by: new Date(form.expires_at).toISOString(),
        parties: parties.map((p) => p.user_id ?? p.email),
        min_verification: "LOGIN",
        use_order_send: false,
        reminders: { frequency: 0, frequency_type: "DAY" },
        category: [],
        copy_recipients: [],
        message: "",
        files: filesData,
      };

      const response = await createOrgContract(selectedOrgId, payload);
      contractId = response.contract_id;

      // 3. na S3 jdou upravené soubory, ne původní
      if (response.upload_urls && response.upload_urls.length > 0) {
        stage = "uploading";
        setSubmitStage("uploading");

        await Promise.all(
          response.upload_urls.map((uploadInfo: any, index: number) =>
            fetch(uploadInfo.upload_url, {
              method: "PUT",
              body: preparedFiles[index],
              headers: { "Content-Type": preparedFiles[index].type },
            }),
          ),
        );

        stage = "finalizing";
        setSubmitStage("finalizing");
        await completeContract(selectedOrgId, contractId!, "VERIFY");
      }

      setSubmitStage("done");
      showSnackbar("Contract created successfully", "success");
      router.push("/app/contracts");
    } catch (e) {
      setSubmitStage("idle");

      if (stage === "creating") {
        setSubmitError(
          "Failed to create the contract. Check the details and parties.",
        );
        setActiveStep(0);
      } else if (stage === "uploading") {
        setSubmitError("Failed to upload one or more files. Please try again.");
        setActiveStep(2);
      } else {
        setSubmitError("Failed to finalize the contract. Please try again.");
        setActiveStep(2);
      }

      showSnackbar("Failed to create contract.", "error");
    }
  };

  return {
    activeStep,
    handleNext,
    handleBack,
    goToStep,

    form,
    handleChange,
    isTitleValid,
    isExpiresAtValid,
    isDetailsValid,

    parties,
    setParties,
    partyEmail,
    setPartyEmail,
    addParty,
    addPartyFromClient,
    addMyself,
    removeParty,
    orgClients,
    isPartiesValid,

    files,
    setFiles,
    handleFileChange,
    removeFile,
    placedFields,
    setPlacedFields,

    submitStage,
    submitError,
    loading,
    handleSubmit,
  };
}
