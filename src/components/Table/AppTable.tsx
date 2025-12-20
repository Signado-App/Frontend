"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";

export type ColumnDef<T> = {
  id: string; 
  header: string; 
  width?: string | number; 
  align?: "left" | "center" | "right";

  cell?: (row: T) => React.ReactNode;
};

type AppTableProps<T> = {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (row: T) => void;
  getRowId?: (row: T) => string | number;
};

export default function AppTable<T extends { id?: string | number }>({
  data,
  columns,
  onRowClick,
  getRowId = (row) => row.id!,
}: AppTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
        }}
      >
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "background.paper" }}>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align || "left"}
                width={col.width}
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  color: "text.primary",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  py: 2,
                }}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row, index) => {
            const rowId = getRowId(row) || index;
            return (
              <TableRow
                key={rowId}
                onClick={() => onRowClick?.(row)}
                sx={{
                  cursor: onRowClick ? "pointer" : "default",
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
              >
                {columns.map((col) => (
                  <TableCell
                    key={`${rowId}-${col.id}`}
                    align={col.align || "left"}
                    sx={{
                      py: 2.5,
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: "text.secondary",
                    }}
                  >
                    {col.cell ? col.cell(row) : (row as any)[col.id]}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
