// src/app/app/contracts/new/page.tsx
"use client";

import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Headline from "@/components/Headline";
import { useRouter } from "next/navigation";
import { useCreateContractForm } from "@/hooks/useContractForm";

const steps = ["Details", "Parties", "Files", "Review"];

export default function NewContractPage() {
  const router = useRouter();
  const {
    activeStep,
    handleNext,
    handleBack,
    goToStep,
    form,
    handleChange,
    isDetailsValid,
    parties,
    setParties,
    partyEmail,
    setPartyEmail,
    addParty,
    addPartyFromClient,
    removeParty,
    orgClients,
    isPartiesValid,
    files,
    handleFileChange,
    removeFile,
    submitStage,
    submitError,
    loading,
    handleSubmit,
  } = useCreateContractForm();

  const stageLabel: Record<string, string> = {
    creating: "Creating contract...",
    uploading: "Uploading files...",
    finalizing: "Finalizing...",
  };

  return (
    <Box>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/app/contracts")}
      >
        Back to Contracts
      </Button>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          mt: 4,
          maxWidth: 700,
        }}
      >
        <Headline
          title="Create Contract"
          description="Fill in the details below to create a new contract."
        />

        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {submitError && <Alert severity="error">{submitError}</Alert>}

        {/* Step 1: Details */}
        {activeStep === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="title"
              label="Title"
              fullWidth
              required
              value={form.title}
              onChange={handleChange}
            />
            <TextField
              name="description"
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={form.description}
              onChange={handleChange}
            />
            <TextField
              name="expires_at"
              label="Expires At"
              type="date"
              fullWidth
              required
              value={form.expires_at}
              onChange={handleChange}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                disabled={!isDetailsValid}
                onClick={handleNext}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 2: Parties */}
        {activeStep === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="body2" fontWeight={600}>
              Add from clients
            </Typography>
            <Select
              value=""
              displayEmpty
              size="small"
              onChange={(e) => {
                const client = orgClients.find(
                  (c) => c.user_id === Number(e.target.value),
                );
                if (client) addPartyFromClient(client);
              }}
            >
              <MenuItem value="" disabled>
                Select client
              </MenuItem>
              {orgClients.map((client) => (
                <MenuItem key={client.id} value={client.user_id}>
                  {client.client_name}
                </MenuItem>
              ))}
            </Select>

            <Divider>or</Divider>

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Email"
                size="small"
                fullWidth
                value={partyEmail}
                onChange={(e) => setPartyEmail(e.target.value)}
              />
              <Button variant="outlined" onClick={addParty}>
                Add
              </Button>
            </Box>

            {parties.length > 0 && (
              <List dense>
                {parties.map((party, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton onClick={() => removeParty(index)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={party.email}
                      secondary={party.role}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={handleBack}>Back</Button>
              <Button
                variant="contained"
                disabled={!isPartiesValid}
                onClick={handleNext}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 3: Files */}
        {activeStep === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileOutlinedIcon />}
              sx={{ alignSelf: "flex-start" }}
            >
              Attach Files
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>

            {files.length > 0 && (
              <List dense>
                {files.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton onClick={() => removeFile(index)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button onClick={handleBack}>Back</Button>
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </Box>
          </Box>
        )}

        {/* Step 4: Review */}
        {activeStep === 3 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="subtitle1" fontWeight={700}>
              Contract Summary
            </Typography>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Title
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {form.title}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Expires At
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {form.expires_at}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Parties ({parties.length})
              </Typography>
              {parties.map((p, i) => (
                <Typography key={i} variant="body2">
                  {p.email}
                </Typography>
              ))}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Files ({files.length})
              </Typography>
              {files.map((f, i) => (
                <Typography key={i} variant="body2">
                  {f.name}
                </Typography>
              ))}
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Button onClick={handleBack} disabled={loading}>
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
              >
                {loading
                  ? (stageLabel[submitStage] ?? "Working...")
                  : "Create Contract"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
