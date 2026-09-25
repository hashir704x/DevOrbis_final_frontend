import { Spinner } from "@/components/ui/spinner";
import type { Task } from "@/types";
import {
  CalendarBlankIcon,
  ClipboardTextIcon,
  ClockIcon,
  FlagIcon,
  UserCircleIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/utils/backend-url";
import { formatDate, getStatusLabel } from "@/utils/task-formatters";

function UserHome() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLead, setIsLead] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BACKEND_URL}/api/tasks/get-user-tasks`, {
          method: "GET",
          credentials: "include",
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to fetch tasks");
        }
        setIsLead(result.data.isLead);
        setTasks(result.data.tasks);
      } catch (error) {
        console.error("Failed to fetch user tasks:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong while fetching tasks.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-black">Something went wrong</h2>
          <p className="mt-2 text-sm text-neutral-500">{error}</p>
        </div>
      </div>
    );
  }
  if (!isLead) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mb-4 flex justify-center mt-44">
            <UserCircleIcon
              size={42}
              weight="regular"
              className="text-neutral-400"
            />
          </div>

          <h2 className="text-xl font-semibold text-black">
            You're not a CodeNest lead yet
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            Task information is available for CodeNest leads. Once you become a lead,
            your assigned tasks will appear here.
          </p>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="max-w-md text-center">
          <div className="mb-4 flex justify-center mt-44">
            <ClipboardTextIcon
              size={42}
              weight="regular"
              className="text-neutral-400"
            />
          </div>

          <h2 className="text-xl font-semibold text-black">No tasks yet</h2>

          <p className="mt-2 text-sm text-neutral-500">
            You don't have any tasks assigned to you yet.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-black">My Tasks</h1>

        <p className="mt-1 text-sm text-neutral-500">
          Track the tasks related to your project.
        </p>
      </div>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4">
              {/* Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-black">{task.title}</h2>

                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    {task.description}
                  </p>
                </div>

                <span
                  className={`w-fit shrink-0 rounded-full border-2 px-3 py-1 text-xs font-medium`}
                >
                  {getStatusLabel(task.status)}
                </span>
              </div>

              {/* Task metadata */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-neutral-100 pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <FlagIcon size={17} weight="regular" />

                  <span className="text-neutral-500">Priority:</span>

                  <span className={`font-medium`}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-neutral-500">
                  <CalendarBlankIcon size={17} weight="regular" />

                  <span>Created {formatDate(task.createdAt)}</span>
                </div>

                <div className="flex items-center gap-2 text-neutral-500">
                  <ClockIcon size={17} weight="regular" />

                  <span>Updated {formatDate(task.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserHome;
