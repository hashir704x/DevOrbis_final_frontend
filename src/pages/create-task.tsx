import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";
import type { Staff, Lead, User } from "@/types";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createTaskSchema } from "@/zod-schemas/task-schema";
import { toast } from "@/components/ui/toast";
import { CreateTaskWithAi } from "@/components/create-task/create-task-with-ai";
import { BACKEND_URL } from "@/utils/backend-url";

function CreateTask() {
  const user = useAuthStore((state) => state.user) as User;
  const role = user.role;
  const [leads, setLeads] = useState<Lead[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        setError(null);
        const leadsResponse = await fetch(`${BACKEND_URL}/api/lead/get-all-leads`, {
          method: "GET",
          credentials: "include",
        });
        if (!leadsResponse.ok) {
          throw new Error("Failed to fetch leads");
        }
        const leadsData = await leadsResponse.json();
        setLeads(leadsData.data);
        if (role === "admin") {
          const staffResponse = await fetch(
            `${BACKEND_URL}/api/staff/get-all-staff`,
            {
              method: "GET",
              credentials: "include",
            },
          );
          if (!staffResponse.ok) {
            throw new Error("Failed to fetch staff members");
          }
          const staffData = await staffResponse.json();
          setStaff(staffData.data);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong while fetching data");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSubmitting(true);
      const body: {
        leadId: string;
        title: string;
        description: string;
        priority: "low" | "medium" | "high";
        assignedTo?: string;
      } = {
        leadId: selectedLead,
        title,
        description,
        priority,
      };
      if (role === "admin") {
        body.assignedTo = assignedTo;
      }
      const validationResult = createTaskSchema.safeParse(body);
      if (!validationResult.success) {
        toast.add({
          type: "error",
          description:
            validationResult.error.issues[0]?.message || "Invalid form data",
        });
        return;
      }
      const response = await fetch(`${BACKEND_URL}/api/tasks/create-task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(validationResult.data),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create task");
      }
      toast.add({
        type: "success",
        description: "Task created successfully",
      });

      setSelectedLead("");
      setTitle("");
      setDescription("");
      setPriority("medium");
      setAssignedTo("");
    } catch (error) {
      if (error instanceof Error) {
        toast.add({
          type: "error",
          description: error.message,
        });
      } else {
        toast.add({
          type: "error",
          description: "Something went wrong while creating the task",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium text-destructive">
            Failed to load task data
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto w-full max-w-3xl py-2">
      <div className="mb-4 flex items-center justify-between px-6">
        <h1 className="text-xl font-medium">Create a new Task for leads</h1>

        <CreateTaskWithAi
          setDescription={setDescription}
          setPriority={setPriority}
          setTitle={setTitle}
        />
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border bg-background shadow-sm">
        <div className="border-b px-6 py-5 sm:px-8">
          <h2 className="text-base font-semibold">Task details</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Provide the information needed to track and complete this task.
          </p>
        </div>

        <form
          className="space-y-5 px-6 py-6 sm:px-6 sm:py-6"
          onSubmit={handleSubmit}
        >
          {/* Lead */}
          <div className="space-y-2">
            <Label htmlFor="lead" className="text-sm font-medium">
              Lead
            </Label>

            <p className="text-xs text-muted-foreground">
              Select the lead this task belongs to.
            </p>

            {leads.length > 0 ? (
              <Select
                value={selectedLead}
                onValueChange={(value) => {
                  if (value !== null) {
                    setSelectedLead(value);
                  }
                }}
              >
                <SelectTrigger id="lead" className="h-11">
                  <SelectValue placeholder="Select a lead">
                    {selectedLead
                      ? leads.find((lead) => lead.id === selectedLead)?.username
                      : "Select a lead"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {leads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  No leads are currently available.
                </p>
              </div>
            )}
          </div>

          {/* Task title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Task title
            </Label>

            <Input
              id="title"
              type="text"
              placeholder="e.g. Prepare project proposal"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-11"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>

            <Textarea
              id="description"
              placeholder="Describe what needs to be done..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-32 resize-none"
            />

            <p className="text-xs text-muted-foreground">
              Include the important details, requirements, or expected outcome.
            </p>
          </div>

          {/* Priority + Assignment */}
          <div
            className={role === "admin" ? "grid gap-7 sm:grid-cols-2" : "grid gap-7"}
          >
            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>

              <Select
                value={priority}
                onValueChange={(value) => {
                  if (value === "low" || value === "medium" || value === "high") {
                    setPriority(value);
                  }
                }}
              >
                <SelectTrigger id="priority" className="h-11">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignment */}
            {role === "admin" && (
              <div className="space-y-2">
                <Label htmlFor="assignedTo" className="text-sm font-medium">
                  Assign to
                </Label>

                {staff.length > 0 ? (
                  <Select
                    value={assignedTo}
                    onValueChange={(value) => {
                      if (value !== null) {
                        setAssignedTo(value);
                      }
                    }}
                  >
                    <SelectTrigger id="assignedTo" className="h-11">
                      <SelectValue placeholder="Select a staff member">
                        {assignedTo
                          ? staff.find((member) => member.id === assignedTo)
                              ?.username
                          : "Select a staff member"}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {staff.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.username}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-3">
                    <p className="text-sm text-muted-foreground">
                      No staff members are currently available.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t pt-6">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                New tasks will start with a pending status.
              </p>

              <Button type="submit" disabled={submitting} className="h-11 px-6">
                {submitting ? "Creating" : "Create task"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
