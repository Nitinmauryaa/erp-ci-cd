"use client";

import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw } from "lucide-react";

interface ApiListPageProps {
  title: string;
  description: string;
  fetchData: () => Promise<unknown>;
  createConfig?: {
    fields: Array<{ key: string; label: string; type?: "text" | "number" | "date" }>;
    onCreate: (payload: Record<string, unknown>) => Promise<void>;
  };
  updateConfig?: {
    idKey: string;
    fields: Array<{ key: string; label: string; type?: "text" | "number" | "date" }>;
    onUpdate: (id: string | number, payload: Record<string, unknown>) => Promise<void>;
  };
  deleteConfig?: {
    idKey: string;
    onDelete: (id: string | number) => Promise<void>;
  };
}

type RowData = Record<string, unknown>;

function normalizeRows(payload: unknown): RowData[] {
  if (Array.isArray(payload)) return payload as RowData[];
  if (payload && typeof payload === "object") {
    const maybeData = (payload as { data?: unknown }).data;
    if (Array.isArray(maybeData)) return maybeData as RowData[];
    return [payload as RowData];
  }
  return [];
}

export function ApiListPage({
  title,
  description,
  fetchData,
  createConfig,
  updateConfig,
  deleteConfig,
}: ApiListPageProps) {
  const [rows, setRows] = useState<RowData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = await fetchData();
      setRows(normalizeRows(payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const columns = useMemo(() => {
    const first = rows[0];
    if (!first) return [];
    return Object.keys(first).slice(0, 6);
  }, [rows]);

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description}>
        <Button variant="outline" size="sm" onClick={() => void load()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </PageHeader>

      {(createConfig || updateConfig) ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Record" : "Create Record"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(editingId ? updateConfig?.fields : createConfig?.fields)?.map((field) => (
                <label key={field.key} className="space-y-1">
                  <span className="text-xs text-muted-foreground">{field.label}</span>
                  <input
                    type={field.type || "text"}
                    value={formState[field.key] || ""}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                </label>
              ))}
            </div>
            <Button
              disabled={isCreating || isUpdating}
              onClick={async () => {
                const activeFields = (editingId ? updateConfig?.fields : createConfig?.fields) || [];
                try {
                  const payload: Record<string, unknown> = {};
                  for (const field of activeFields) {
                    const raw = formState[field.key];
                    payload[field.key] =
                      field.type === "number" ? Number(raw || 0) : raw;
                  }
                  if (editingId && updateConfig) {
                    setIsUpdating(true);
                    await updateConfig.onUpdate(editingId, payload);
                  } else if (createConfig) {
                    setIsCreating(true);
                    await createConfig.onCreate(payload);
                  }
                  setFormState({});
                  setEditingId(null);
                  await load();
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Create failed.");
                } finally {
                  setIsCreating(false);
                  setIsUpdating(false);
                }
              }}
            >
              {isCreating ? "Creating..." : isUpdating ? "Updating..." : editingId ? "Update" : "Create"}
            </Button>
            {editingId ? (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setFormState({});
                }}
              >
                Cancel Edit
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Loading data...</p>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && rows.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">No records found.</p>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && rows.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{title} Records</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                  {(updateConfig || deleteConfig) ? <TableHead>Actions</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, idx) => (
                  <TableRow key={String(row.id ?? idx)}>
                    {columns.map((column) => (
                      <TableCell key={column}>{String(row[column] ?? "-")}</TableCell>
                    ))}
                    {(updateConfig || deleteConfig) ? (
                      <TableCell className="space-x-2">
                        {updateConfig ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const id = row[updateConfig.idKey] as string | number;
                              if (id === undefined || id === null) {
                                setError(`Cannot edit: missing ${updateConfig.idKey}`);
                                return;
                              }
                              const nextState: Record<string, string> = {};
                              updateConfig.fields.forEach((field) => {
                                nextState[field.key] = String(row[field.key] ?? "");
                              });
                              setFormState(nextState);
                              setEditingId(id);
                            }}
                          >
                            Edit
                          </Button>
                        ) : null}
                        {deleteConfig ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={async () => {
                              const id = row[deleteConfig.idKey] as string | number;
                              if (id === undefined || id === null) {
                                setError(`Cannot delete: missing ${deleteConfig.idKey}`);
                                return;
                              }
                              setIsDeleting(true);
                              setError(null);
                              try {
                                await deleteConfig.onDelete(id);
                                if (editingId === id) {
                                  setEditingId(null);
                                  setFormState({});
                                }
                                await load();
                              } catch (err) {
                                setError(err instanceof Error ? err.message : "Delete failed.");
                              } finally {
                                setIsDeleting(false);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        ) : null}
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
