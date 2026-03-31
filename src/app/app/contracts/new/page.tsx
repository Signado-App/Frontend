"use client";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import Headline from "@/components/Headline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { useCreateContractForm } from "@/hooks/useContractForm";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useState } from "react";

export default function NewContractPage() {
  const router = useRouter();
  const {
    form,
    error,
    loading,
    handleChange,
    handleSubmit,
    isTitleValid,
    files,
    setFiles,
    handleFileChange,
    removeFile,
  } = useCreateContractForm();

  return (
    <Box>
      <Button
        variant="text"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/app/contracts")}
      >
        Back to Contracts
      </Button>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 4 }}>
        <Headline
          title="Create Contract"
          description="Fill in the details below to create a new contract."
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: 600,
          }}
        >
          <TextField
            id="title"
            name="title"
            label="Title"
            fullWidth
            required
            value={form.title}
            onChange={handleChange}
            error={form.title.length > 0 && !isTitleValid}
            helperText={
              form.title.length > 0 && !isTitleValid ? "Title is required" : ""
            }
          />
          <TextField
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            fullWidth
            value={form.description}
            onChange={handleChange}
          />
          <TextField
            id="expires_at"
            name="expires_at"
            label="Expires At"
            type="date"
            fullWidth
            required
            value={form.expires_at}
            onChange={handleChange}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { style: { paddingTop: "25px" } },
            }}
          />

          <Box>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFileOutlinedIcon />}
            >
              Attach Files
              <input type="file" hidden multiple onChange={handleFileChange} />
            </Button>

            {files.length > 0 && (
              <List dense sx={{ mt: 1 }}>
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
          </Box>

          <Button
            variant="contained"
            sx={{ alignSelf: "flex-start" }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Contract"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
