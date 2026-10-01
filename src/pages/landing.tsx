import { Link } from "react-router";
import {
    ArrowRightIcon,
    SparkleIcon,
} from "@phosphor-icons/react";
import { useAuthStore } from "@/store/authStore";

import LandingFooter from "@/components/landing/landing-footer";
import LandingHero from "@/components/landing/landing-hero";

function Landing() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const user = useAuthStore((state) => state.user);
    const dashboardPath = user ? `/${user.role}` : "/login";

    return (
        <main className="min-h-screen bg-white text-black">
            {/* Navbar */}
            <nav className="border-b border-black/10">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white">
                            <SparkleIcon size={20} weight="fill" />
                        </div>

                        <span className="text-lg font-semibold tracking-tight">
                            AI Operations
                        </span>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <Link
                                to={dashboardPath}
                                className="flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/80"
                            >
                                Open Dashboard
                                <ArrowRightIcon size={17} />
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-lg px-4 py-2.5 text-sm font-medium transition hover:bg-black/5"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/sign-up"
                                    className="flex items-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black/80"
                                >
                                    Get Started
                                    <ArrowRightIcon size={17} />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <LandingHero />

            <LandingFooter />
        </main>
    );
}

export default Landing;
