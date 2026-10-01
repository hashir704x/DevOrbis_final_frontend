import { useAuthStore } from "@/store/authStore";
import {
    SparkleIcon,
    ArrowRightIcon,
    CheckIcon,
    TargetIcon,
    ListChecksIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router";
import LandingCoverEdited from "@/assets/landing_cover_edited.jpeg";

function LandingHero() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const dashboardPath = user ? `/${user.role}` : "/login";
    return (
        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
                {/* Left Content */}
                <div>
                    {/* Badge */}
                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/3 px-4 py-2 text-sm font-medium">
                        <SparkleIcon size={15} weight="fill" />
                        AI-powered operations platform
                    </div>

                    {/* Heading */}
                    <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                        Turn conversations into{" "}
                        <span className="relative">opportunities.</span>
                    </h1>

                    {/* Description */}
                    <p className="mt-7 max-w-xl text-lg leading-8 text-black/60">
                        Generate qualified leads, organize your workflow, and manage
                        tasks with an intelligent AI-powered operations system built
                        to keep your team moving.
                    </p>

                    {/* CTA */}
                    <div className="mt-9 flex flex-wrap items-center gap-4">
                        {isAuthenticated ? (
                            <Link
                                to={dashboardPath}
                                className="group flex items-center gap-3 rounded-xl bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-black/85"
                            >
                                Go to your workspace
                                <ArrowRightIcon
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/sign-up"
                                    className="group flex items-center gap-3 rounded-xl bg-black px-6 py-3.5 text-sm font-medium text-white transition hover:bg-black/85"
                                >
                                    Start generating leads
                                    <ArrowRightIcon
                                        size={18}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>

                                <Link
                                    to="/login"
                                    className="rounded-xl border border-black/15 px-6 py-3.5 text-sm font-medium transition hover:bg-black/5"
                                >
                                    Sign in
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Trust points */}
                    <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-black/55">
                        <div className="flex items-center gap-2">
                            <CheckIcon size={16} weight="bold" />
                            AI-assisted lead generation
                        </div>

                        <div className="flex items-center gap-2">
                            <CheckIcon size={16} weight="bold" />
                            Intelligent task management
                        </div>
                    </div>
                </div>

                {/* Image / Visual */}
                <div className="relative">
                    {/* Decorative background */}
                    <div className="absolute -inset-4 rounded-[2rem] bg-black/2.5" />

                    <div className="relative overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#f7f7f7] shadow-2xl shadow-black/10">
                        {/* Replace this path with your image */}
                        <img
                            src={LandingCoverEdited}
                            alt="AI Operations illustration"
                            className="aspect-4/3 w-full object-cover"
                        />

                        {/* Remove this overlay if your image doesn't need it */}
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/10 via-transparent to-white/20" />
                    </div>

                    {/* Floating Lead Card */}
                    <div className="absolute -bottom-7 -left-6 hidden w-64 rounded-2xl border border-black/10 bg-white p-4 shadow-xl sm:block">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                                <TargetIcon size={20} weight="bold" />
                            </div>

                            <div>
                                <p className="text-xs text-black/45">
                                    New qualified lead
                                </p>
                                <p className="text-sm font-semibold">
                                    Lead identified
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-black/10">
                            <div className="h-full w-[82%] rounded-full bg-black" />
                        </div>
                    </div>

                    {/* Floating Task Card */}
                    <div className="absolute -right-5 top-8 hidden w-52 rounded-2xl border border-black/10 bg-white p-4 shadow-xl lg:block">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                                <ListChecksIcon size={18} weight="bold" />
                            </div>

                            <div>
                                <p className="text-xs text-black/45">
                                    Today's workflow
                                </p>
                                <p className="text-sm font-semibold">
                                    Tasks organized
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="h-2 w-full rounded-full bg-black/10" />
                            <div className="h-2 w-4/5 rounded-full bg-black/10" />
                            <div className="h-2 w-3/5 rounded-full bg-black/10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LandingHero;
