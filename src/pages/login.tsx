import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { useAuthStore } from "@/store/authStore";
import LoginCover from "@/assets/login-cover.jpeg";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema } from "@/zod-schemas/auth-schemas";
import { toast } from "@/components/ui/toast";
import { BACKEND_URL } from "@/utils/backend-url";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validation = loginSchema.safeParse({
            email,
            password,
        });
        if (!validation.success) {
            toast.add({
                type: "error",
                description: validation.error.issues[0].message,
            });
            return;
        }
        try {
            setLoginLoading(true);
            const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            if (result.data.requiresVerification) {
                localStorage.setItem("pendingVerificationEmail", result.data.email);
                toast.add({
                    type: "success",
                    description: "Please verify your email to continue.",
                });
                navigate("/verify-email");
                return;
            }
            setUser(result.data);
            toast.add({
                type: "success",
                description: "Login successful!",
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.add({
                    type: "error",
                    description: error.message,
                });
            } else {
                toast.add({
                    type: "error",
                    description: "Failed to login, something went wrong.",
                });
            }
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <main className="grid min-h-screen lg:grid-cols-2">
            {/* Image */}
            <div className="relative hidden overflow-hidden bg-black lg:block">
                <img
                    src={LoginCover}
                    alt="AI"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute bottom-10 left-10 max-w-md text-white">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Welcome.
                    </h2>

                    <p className="mt-3 text-sm text-white/70">
                        Continue building and interacting with intelligent systems.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="flex min-h-screen items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Welcome
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Log in to continue to your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    Password
                                </label>
                            </div>

                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <button
                            disabled={loginLoading}
                            type="submit"
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-black text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {loginLoading ? (
                                <Spinner />
                            ) : (
                                <>
                                    Login
                                    <ArrowRightIcon size={18} weight="regular" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            to="/sign-up"
                            className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Login;
