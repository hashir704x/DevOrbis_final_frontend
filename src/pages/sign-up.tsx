import { useState } from "react";
import { Link } from "react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import SignUpCover from "@/assets/sign-up-cover.jpeg";
import { toast } from "@/components/ui/toast";
import { Spinner } from "@/components/ui/spinner";
import { signUpSchema } from "@/zod-schemas/auth-schemas";
import { useNavigate } from "react-router";

function SignUp() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signupLoading, setSignupLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validation = signUpSchema.safeParse({
            username,
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
            setSignupLoading(true);
            const response = await fetch("http://localhost:3000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            localStorage.setItem("pendingVerificationEmail", email);
            toast.add({
                type: "success",
                description: "Signup successfull, please verify your email now!",
            });
            navigate("/verify-email");
        } catch (error) {
            if (error instanceof Error) {
                toast.add({
                    type: "error",
                    description: error.message,
                });
            } else {
                toast.add({
                    type: "error",
                    description: "Failed to signup, something went wrong",
                });
            }
        } finally {
            setSignupLoading(false);
        }
    };

    return (
        <main className="grid min-h-screen lg:grid-cols-2">
            {/* Image */}
            <div className="relative hidden overflow-hidden bg-black lg:block">
                <img
                    src={SignUpCover}
                    alt="AI"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute bottom-10 left-10 max-w-md text-white">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Build with intelligence.
                    </h2>

                    <p className="mt-3 text-sm text-white/70">
                        Your workspace for building and interacting with intelligent
                        systems.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="flex min-h-screen items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Create an account
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Create your account to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label
                                htmlFor="username"
                                className="text-sm font-medium"
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            />
                        </div>

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
                            <label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <button
                            disabled={signupLoading}
                            type="submit"
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-black text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {signupLoading ? (
                                <Spinner />
                            ) : (
                                <>
                                    Create account
                                    <ArrowRightIcon size={18} weight="regular" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default SignUp;