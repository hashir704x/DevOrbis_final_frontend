import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowSquareOutIcon,
  CalendarBlankIcon,
  ClipboardTextIcon,
  ClockIcon,
  EnvelopeIcon,
  FlagIcon,
  PencilSimpleIcon,
  UserCircleIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { Spinner } from "@/components/ui/spinner";
import type { TaskDetail as TaskDetailType } from "@/types";
import {
  formatDate,
  formatDateTime,
  getPriorityLabel,
  getStatusIcon,
  getStatusLabel,
} from "@/utils/task-formatters";
import { Button } from "@/components/ui/button";
import { BACKEND_URL } from "@/utils/backend-url";

function TaskDetail() {
  const { taskId } = useParams();

  const [task, setTask] = useState<TaskDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async function () {
      if (!taskId) {
        setError("Invalid task ID.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `${BACKEND_URL}/api/tasks/get-task-detail/${taskId}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch task details.");
        }
        setTask(data.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong while fetching the task.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [taskId]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spinner className="size-7" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-black text-white">
            <WarningCircleIcon size={28} weight="bold" />
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-black">
            Unable to load task
          </h2>

          <p className="mt-2 text-sm leading-6 text-black/55">
            {error || "The requested task could not be found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="overflow-hidden rounded-3xl border-2">
          <div className="flex flex-col gap-6 p-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em]">
                <ClipboardTextIcon size={14} weight="bold" />
                Task details
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {task.title}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6">
                Detailed information about this task and its associated lead.
              </p>
            </div>

            <Link to={`/staff-admin/edit-task/${task.id}`}>
              <Button className="w-full rounded-lg cursor-pointer h-10">
                <PencilSimpleIcon size={17} weight="bold" />
                Edit task
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main task information */}
          <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
            <div className="border-b border-black/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
                Task information
              </p>
            </div>

            <div className="p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-xl border border-black/10 bg-black/2.5 p-4">
                  <div className="flex items-center gap-2 text-black/45">
                    {getStatusIcon(task.status)}

                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Status
                    </span>
                  </div>

                  <p className="mt-2 font-semibold text-black">
                    {getStatusLabel(task.status)}
                  </p>
                </div>

                <div className="rounded-xl border border-black/10 bg-black/2.5 p-4">
                  <div className="flex items-center gap-2 text-black/45">
                    <FlagIcon size={20} weight="bold" />

                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Priority
                    </span>
                  </div>

                  <p className="mt-2 font-semibold text-black">
                    {getPriorityLabel(task.priority)}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
                  Description
                </p>

                <p className="mt-3 text-sm leading-7 text-black/65">
                  {task.description}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
                  Assigned Staff
                </p>

                <Link
                  to={`/staff-details/${task.assignedTo}`}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-black/10 bg-black/2 px-4 py-3 text-sm font-medium text-black transition-colors hover:border-black/20 hover:bg-black hover:text-white"
                >
                  <UserCircleIcon size={18} weight="bold" />
                  <span>{task.assignedStaffName}</span>
                  <ArrowSquareOutIcon size={15} weight="bold" />
                </Link>
              </div>
            </div>
          </div>

          {/* Lead information */}
          <div className="rounded-2xl border border-black/10 bg-white shadow-sm">
            <div className="border-b border-black/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
                Associated lead
              </p>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                  <UserCircleIcon size={24} weight="duotone" />
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-black">{task.leadName}</p>

                  <p className="mt-0.5 truncate text-sm text-black/50">Lead</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <EnvelopeIcon
                    size={18}
                    className="mt-0.5 shrink-0 text-black/40"
                  />

                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-black/35">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-black">
                      {task.leadEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CalendarBlankIcon
                    size={18}
                    className="mt-0.5 shrink-0 text-black/40"
                  />

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-black/35">
                      Created
                    </p>

                    <p className="mt-1 text-sm font-medium text-black">
                      {formatDate(task.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ClockIcon size={18} className="mt-0.5 shrink-0 text-black/40" />

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-black/35">
                      Last updated
                    </p>

                    <p className="mt-1 text-sm font-medium text-black">
                      {formatDateTime(task.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task identifiers */}
        <div className="mt-6 rounded-2xl border border-black/10 bg-black/2 p-5">
          <div className="flex flex-col gap-2 text-xs text-black/40 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Task ID: <span className="font-medium text-black/60">{task.id}</span>
            </span>

            <span>
              Lead ID:{" "}
              <span className="font-medium text-black/60">{task.leadId}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
