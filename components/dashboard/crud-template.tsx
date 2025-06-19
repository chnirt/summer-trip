// https://github.com/shadcn-ui/ui/blob/84d6c83bad10e995bd648d59403f402ce7728444/apps/www/registry/new-york/internal/dashboard-06.tsx#L274
"use client";

import CreateUpdateAlertDialog, { Fields } from "./cu-alert-dialog";
import MyAlertDialog from "./my-alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { get } from "lodash";
import { Loader2, MoreHorizontal, PlusCircle } from "lucide-react";
import { Fragment, JSX, useCallback, useEffect, useState } from "react";
import { FieldValues, useFormContext } from "react-hook-form";
import { toast } from "sonner";

type Header = {
  field: string;
  title?: JSX.Element | string | undefined;
  classNames?: {
    tableHead?: string;
    tableCell?: string;
    tableRow?: string;
    tableBody?: string;
  };
  render?: (value: unknown) => unknown;
};

type Headers = Header[];

type Action = {
  key: string;
  label?: string;
  onClick?: (id: string) => void;
};

type Actions = Action[];

type CRUDTemplateProps = {
  table: string;
  model: string;
  defaultFormValues: FieldValues | { [x: string]: unknown } | undefined;
  headers: Headers;
  fields: Fields;
  actions?: Actions;
  canCreate?: boolean;
  fetcher?: (params: {
    from: number;
    to: number;
  }) => Promise<{ data: unknown[]; count: number | null }>;
};

type Data = {
  id: string;
  [x: string]: unknown;
}[];

export default function CRUDTemplate({
  table,
  model,
  defaultFormValues,
  headers,
  fields,
  actions,
  canCreate = true,
  fetcher,
}: CRUDTemplateProps) {
  const methods = useFormContext();

  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [createUpdateOpen, setCreateUpdateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);

  const [data, setData] = useState<Data>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const tableTitle = `${model}s`;
  const tableDescription = `Manage your connected ${model}s. View details, edit settings, or perform actions.`;
  const createButtonText = `Create ${model}`;
  const createForm = {
    title: `New ${model}`,
    description: `Fill out the following information to register a new ${model} in the system.`,
    submitText: "Create",
  };
  const updateForm = {
    title: `Update ${model}`,
    description: `Fill out the following information to update this ${model} in the system.`,
    submitText: "Update",
  };
  const deleteForm = {
    title: `Delete ${model}`,
    description: `Are you sure you want to delete this ${model}?`,
    submitText: "Delete",
  };
  const startIndex = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  function handleShowCreateAlertDialog() {
    setCreateUpdateOpen(true);
  }

  async function handleCreate(values: unknown) {
    // NOTE: call api to create
    if (typeof handleOnCreate === "function" && values) {
      await handleOnCreate(values);
    }

    setCreateUpdateOpen(false);
  }

  function handleCreateOnCancel() {
    setCreateUpdateOpen(false);
    if (typeof handleOnCancel === "function") {
      handleOnCancel();
    }
  }

  async function handleShowUpdateAlertDialog(id: string) {
    // NOTE: call api to fetch
    if (typeof handleOnFetchById === "function" && id) {
      await handleOnFetchById(id);
    }

    setSelectedId(id);
    setCreateUpdateOpen(true);
  }

  async function handleUpdate(values: unknown) {
    // NOTE: call api to update
    if (typeof handleOnUpdate === "function" && selectedId && values) {
      await handleOnUpdate(selectedId, values);
    }

    setSelectedId(undefined);
    setCreateUpdateOpen(false);
  }

  function handleUpdateOnCancel() {
    setSelectedId(undefined);
    setCreateUpdateOpen(false);
    if (typeof handleOnCancel === "function") {
      handleOnCancel();
    }
  }

  function handleShowDeleteAlertDialog(id: string) {
    setSelectedId(id);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    // NOTE: call api to delete
    if (typeof handleOnDelete === "function" && selectedId) {
      await handleOnDelete(selectedId);
    }

    setSelectedId(undefined);
    setDeleteOpen(false);
  }

  function handleDeleteOnCancel() {
    setSelectedId(undefined);
    setDeleteOpen(false);
  }

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      let result;
      if (fetcher) {
        result = await fetcher({ from, to });
      } else {
        const supabase = createClient();
        const { data, error, count } = await supabase
          .from(table)
          .select("*", { count: "exact" })
          .range(from, to)
          .order("created_at", { ascending: false });

        if (error) {
          console.error(`Error fetching ${model} data:`, error);
          toast.error(`Failed to fetch ${model} data: ${error.message}`);
          return;
        }

        result = { data: data || [], count };
      }
      setData(result.data);
      if (result.count !== null) {
        setTotal(result.count);
        setTotalPages(Math.ceil(result.count / pageSize));
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error("Unexpected error:", error);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, model, pageSize, table]);

  const resetForm = useCallback(() => {
    methods.reset(defaultFormValues);
  }, [defaultFormValues, methods]);

  const handleOnFetchById = useCallback(
    async (id: string) => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error(`Error fetching ${model} with id ${id}:`, error);
          toast.error(`Failed to fetch ${model}: ${error.message}`);
          return;
        }

        if (data) {
          methods.reset(data);
          console.log(`${model} fetched:`, data);
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          console.error("Unexpected error:", error);
        } else {
          toast.error("An unexpected error occurred");
          console.error("Unknown error:", error);
        }
      }
    },
    [methods, model, table],
  );

  const handleOnCreate = async (values: unknown) => {
    setDialogLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from(table)
        .insert(values)
        .select();

      if (error) {
        console.error(`Error inserting ${model}:`, error);
        toast.error(`Failed to create ${model}: ${error.message}`);
        return;
      }

      console.log(`${model} created:`, data);
      toast.success(`${model} created successfully!`);
      resetForm();
      fetchData();
    } catch (error) {
      // Use unknown type and type guard here if you want to avoid any
      if (error instanceof Error) {
        toast.error(error.message);
        console.error("Unexpected error:", error);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Unknown error:", error);
      }
    } finally {
      setDialogLoading(false);
    }
  };

  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatDateValues = (obj: unknown): unknown => {
    const formattedObj = { ...(obj as Record<string, unknown>) };
    for (const key in formattedObj) {
      if (formattedObj[key] instanceof Date) {
        formattedObj[key] = formatLocalDate(formattedObj[key]);
      }
    }
    return formattedObj;
  };

  const handleOnUpdate = async (id: string, values: unknown) => {
    setDialogLoading(true);
    try {
      const supabase = createClient();
      const formattedValues = formatDateValues(values);
      const { data, error } = await supabase
        .from(table)
        .update(formattedValues)
        .eq("id", id)
        .select();

      if (error) {
        console.error(`Error updating ${model}:`, error);
        toast.error(`Failed to update ${model}: ${error.message}`);
        return;
      }

      console.log(`${model} updated:`, data);
      toast.success(`${model} updated successfully!`);
      resetForm();
      fetchData();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error("Unexpected error:", error);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Unknown error:", error);
      }
    } finally {
      setDialogLoading(false);
    }
  };

  const handleOnDelete = async (id: string) => {
    setDialogLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from(table)
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        console.error(`Error deleting ${model}:`, error);
        toast.error(`Failed to delete ${model}: ${error.message}`);
        return;
      }

      console.log(`${model} deleted:`, data);
      toast.success(`${model} deleted successfully!`);
      fetchData();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error("Unexpected error:", error);
      } else {
        toast.error("An unexpected error occurred");
        console.error("Unknown error:", error);
      }
    } finally {
      setDialogLoading(false);
    }
  };

  const handleOnCancel = useCallback(() => {
    resetForm();
  }, [resetForm]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="px-4 lg:px-6">
      <Tabs defaultValue="all">
        <div className="flex items-center gap-2">
          {/* <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full backdrop-blur">
            <form>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                <Input placeholder="Search" className="flex-1 pl-8" />
              </div>
            </form>
          </div> */}
          {/* <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList> */}
          <div className="ml-auto flex items-center gap-2">
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
            {/* <Button size="sm" variant="outline" className="h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button> */}
            {canCreate ? (
              <Button
                size="sm"
                className="h-7 gap-1"
                onClick={handleShowCreateAlertDialog}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {createButtonText}
                </span>
              </Button>
            ) : null}
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>{tableTitle}</CardTitle>
              <CardDescription>{tableDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((header, hi) => (
                      <TableHead
                        key={[header.field, hi].join("-")}
                        className={cn(
                          "max-w-[100px]",
                          header.classNames?.tableHead,
                        )}
                      >
                        {header.title}
                      </TableHead>
                    ))}
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={headers.length + 1}
                        className="py-10 text-center"
                      >
                        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                      </TableCell>
                    </TableRow>
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={headers.length + 1}
                        className="py-10 text-center"
                      >
                        No data found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((item, ii) => {
                      return (
                        <TableRow key={[item.name, ii].join("-")}>
                          {headers.map((header, hi) => {
                            const value = get(item, header.field) || null;
                            return (
                              <TableCell
                                key={[header.field, hi].join("-")}
                                className={cn(
                                  "max-w-[100px] truncate whitespace-pre-wrap",
                                  header.classNames?.tableCell,
                                )}
                              >
                                <>
                                  {typeof header?.render === "function" && value
                                    ? header.render(value)
                                    : value}
                                </>
                              </TableCell>
                            );
                          })}
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                {actions?.length ? (
                                  actions?.map((action, ai) => {
                                    const isUpdate = action.key === "update";
                                    const isDelete = action.key === "delete";
                                    const onClick = () => {
                                      if (
                                        typeof action?.onClick === "function"
                                      ) {
                                        action?.onClick(item.id);
                                      }
                                      if (isUpdate) {
                                        handleShowUpdateAlertDialog(item.id);
                                      }
                                      if (isDelete) {
                                        handleShowDeleteAlertDialog(item.id);
                                      }
                                    };
                                    const label = isUpdate
                                      ? "Update"
                                      : isDelete
                                        ? "Delete"
                                        : action.label;
                                    if (action.key === "separator") {
                                      return (
                                        <DropdownMenuSeparator
                                          key={[ai].join("-")}
                                        />
                                      );
                                    }
                                    return (
                                      <DropdownMenuItem
                                        key={[ai].join("-")}
                                        onClick={onClick}
                                      >
                                        {label}
                                      </DropdownMenuItem>
                                    );
                                  })
                                ) : (
                                  <Fragment>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleShowUpdateAlertDialog(item.id)
                                      }
                                    >
                                      Update
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleShowDeleteAlertDialog(item.id)
                                      }
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </Fragment>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-muted-foreground text-xs">
                Showing{" "}
                <strong>
                  {startIndex}-{endIndex}
                </strong>{" "}
                of <strong>{total}</strong>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <MyAlertDialog
        title={deleteForm.title}
        description={deleteForm.description}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSubmit={handleDelete}
        submitText={deleteForm.submitText}
        onCancel={handleDeleteOnCancel}
        loading={dialogLoading}
      />

      {selectedId ? (
        <CreateUpdateAlertDialog
          title={updateForm.title}
          description={updateForm.description}
          open={createUpdateOpen}
          onOpenChange={setCreateUpdateOpen}
          fields={fields}
          onSubmit={handleUpdate}
          submitText={updateForm.submitText}
          onCancel={handleUpdateOnCancel}
          loading={dialogLoading}
        />
      ) : (
        <CreateUpdateAlertDialog
          title={createForm.title}
          description={createForm.description}
          open={createUpdateOpen}
          onOpenChange={setCreateUpdateOpen}
          fields={fields}
          onSubmit={handleCreate}
          submitText={createForm.submitText}
          onCancel={handleCreateOnCancel}
          loading={dialogLoading}
        />
      )}
    </div>
  );
}
