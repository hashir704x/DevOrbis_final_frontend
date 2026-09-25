import {
  ArrowDownIcon,
  ArrowUpIcon,
  CoinsIcon,
  CpuIcon,
  HashIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import type { AiUsageStats } from "@/types";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { formatCost, formatNumber } from "@/utils/ai-usage-formatters";
import { BACKEND_URL } from "@/utils/backend-url";

function AiUsage() {
  const [stats, setStats] = useState<AiUsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(
          `${BACKEND_URL}/api/ai-usage/get-ai-usage`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch AI usage statistics.");
        }
        setStats(data.data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong while fetching AI usage statistics.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Spinner className="size-7" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-black text-white">
            <WarningCircleIcon size={28} weight="bold" />
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-black">
            Unable to load AI usage
          </h2>

          <p className="mt-2 text-sm leading-6 text-black/55">
            {error || "AI usage statistics could not be loaded."}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className=" bg-white px-6 py-4 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
            AI Usage
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/50">
            Monitor token consumption and estimated AI usage costs across the
            platform.
          </p>
        </div>

        {/* Total tokens */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-black text-white">
          <div className="flex flex-col gap-6 p-7 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-white/10">
                <CpuIcon size={24} weight="duotone" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                Total tokens
              </p>

              <h2 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                {formatNumber(stats.totalTokens)}
              </h2>

              <p className="mt-2 text-sm text-white/50">
                Combined input and output tokens
              </p>
            </div>

            <div className="flex size-24 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6">
              <HashIcon size={38} weight="bold" />
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Input tokens */}
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex size-11 items-center justify-center rounded-xl bg-black text-white">
                <ArrowDownIcon size={22} weight="bold" />
              </div>

              <span className="rounded-full bg-black/4 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-black/45">
                Input
              </span>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
              Input tokens
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
              {formatNumber(stats.totalInputTokens)}
            </p>

            <p className="mt-2 text-sm text-black/45">
              Tokens sent to the AI models
            </p>
          </div>

          {/* Output tokens */}
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex size-11 items-center justify-center rounded-xl bg-black text-white">
                <ArrowUpIcon size={22} weight="bold" />
              </div>

              <span className="rounded-full bg-black/4 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-black/45">
                Output
              </span>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
              Output tokens
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
              {formatNumber(stats.totalOutputTokens)}
            </p>

            <p className="mt-2 text-sm text-black/45">
              Tokens generated by the AI models
            </p>
          </div>

          {/* Cost */}
          <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-start justify-between">
              <div className="flex size-11 items-center justify-center rounded-xl bg-black text-white">
                <CoinsIcon size={22} weight="bold" />
              </div>

              <span className="rounded-full bg-black/4 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-black/45">
                Cost
              </span>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.15em] text-black/40">
              Estimated cost
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-black">
              {formatCost(stats.totalCost)}
            </p>

            <p className="mt-2 text-sm text-black/45">
              Estimated cost based on configured pricing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AiUsage;
