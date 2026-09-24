import { useState } from "react";
import { SparkleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import type { GeneratedTask } from "@/types";
import { toast } from "@/components/ui/toast";

type CreateTaskWithAiProps = {
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setPriority: React.Dispatch<React.SetStateAction<"low" | "medium" | "high">>;
};

export function CreateTaskWithAi({
  setTitle,
  setDescription,
  setPriority,
}: CreateTaskWithAiProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  async function handleGenerateTask() {
    if (!prompt.trim()) {
      setError("Please describe the task you want to generate.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        "http://localhost:3000/api/tasks/create-task-ai",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt.trim(),
          }),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate task details.");
      }
      const generatedTask: GeneratedTask = data.data;
      setTitle(generatedTask.title);
      setDescription(generatedTask.description);
      setPriority(generatedTask.priority);
      setPrompt("");
      toast.add({
        type: "success",
        description: "Fields populated successfully",
      });
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong while generating the task.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen && !loading) {
          setPrompt("");
          setError("");
        }
      }}
      open={open}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            className="gap-2 bg-black text-white hover:bg-black/80 p-4 rounded-lg"
          >
            <SparkleIcon size={17} weight="fill" />
            Use AI
          </Button>
        }
      />

      <DialogContent className="sm:max-w-lg p-8 rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SparkleIcon size={19} weight="fill" />
            Generate task with AI
          </DialogTitle>

          <DialogDescription className="mt-2">
            Describe the task you want to create. AI will generate the title,
            description, and priority for you.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup className="mt-2">
          <Field>
            <Label htmlFor="task-ai-prompt">Task prompt</Label>
            <Textarea
              id="task-ai-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Example: Create website contacts page , with red and white color scheme, its an urgent task. "
              rows={6}
              disabled={loading}
              className="p-4 rounded-lg"
            />
          </Field>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-black/10 bg-black/3 p-3 text-sm text-black/70">
              <WarningCircleIcon
                size={18}
                weight="bold"
                className="mt-0.5 shrink-0"
              />
              <p>{error}</p>
            </div>
          )}
        </FieldGroup>

        <DialogFooter>
          <DialogClose
            render={
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                className="p-4 rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
            }
          />

          <Button
            type="button"
            onClick={handleGenerateTask}
            disabled={loading || !prompt.trim()}
            className="gap-2 bg-black text-white hover:bg-black/80 p-4 rounded-lg cursor-pointer"
          >
            {loading ? (
              <>
                <Spinner className="size-4" />
                Generating
              </>
            ) : (
              <>
                <SparkleIcon size={16} weight="fill" />
                Generate task
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
