import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import verifyEmailCover from "@/assets/verify-email-cover.jpeg";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { verifyOtpSchema } from "@/zod-schemas/auth-schemas";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";
import { BACKEND_URL } from "@/utils/backend-url";

function VerifyEmail() {
    const setUser = useAuthStore((state) => state.setUser);
    const [otp, setOtp] = useState("");
    const [verifyEmailLoading, setVerifyEmailLoading] = useState(false);
    const navigate = useNavigate();
    const [resendLoading, setResendLoading] = useState(false);
    const pendingEmail = localStorage.getItem("pendingVerificationEmail");

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const validation = verifyOtpSchema.safeParse({ otp });
        if (!validation.success) {
            toast.add({
                type: "error",
                description: validation.error.issues[0].message,
            });
            return;
        }
        try {
            setVerifyEmailLoading(true);
            const response = await fetch(
                `${BACKEND_URL}/api/auth/verify-email`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: pendingEmail,
                        otp,
                    }),
                },
            );
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            localStorage.removeItem("pendingVerificationEmail");
            setUser(result.data);
            toast.add({
                type: "success",
                description: "Email verified successfully!",
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
                    description: "Failed to verify email, something went wrong",
                });
            }
        } finally {
            setVerifyEmailLoading(false);
        }
    }

    const handleResendOtp = async () => {
        const email = localStorage.getItem("pendingVerificationEmail");
        try {
            setResendLoading(true);
            const response = await fetch(
                `${BACKEND_URL}/api/auth/resend-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ email }),
                },
            );
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            toast.add({
                type: "success",
                description: "A new OTP has been sent to your email.",
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
                    description: "Failed to resend OTP.",
                });
            }
        } finally {
            setResendLoading(false);
        }
    };

    useEffect(() => {
        if (!pendingEmail) {
            navigate("/login", { replace: true });
            return;
        }
    }, []);

    if (!pendingEmail) {
        return null;
    }

    return (
        <main className="grid min-h-screen lg:grid-cols-2">
            {/* Image */}
            <div className="relative hidden overflow-hidden bg-black lg:block">
                <img
                    src={verifyEmailCover}
                    alt="AI"
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute bottom-10 left-10 max-w-md text-white">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        One step away.
                    </h2>

                    <p className="mt-3 text-sm text-white/70">
                        Verify your email to continue building and interacting with
                        intelligent systems.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="flex min-h-screen items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Verify your email
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            We've sent a 6-digit verification code to your email
                            address.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                            <InputOTPGroup className="w-full justify-evenly">
                                <InputOTPSlot
                                    index={0}
                                    className="border border-black"
                                />
                                <InputOTPSlot
                                    index={1}
                                    className="border border-black"
                                />
                                <InputOTPSlot
                                    index={2}
                                    className="border border-black"
                                />
                                <InputOTPSlot
                                    index={3}
                                    className="border border-black"
                                />
                                <InputOTPSlot
                                    index={4}
                                    className="border border-black"
                                />
                                <InputOTPSlot
                                    index={5}
                                    className="border border-black"
                                />
                            </InputOTPGroup>
                        </InputOTP>

                        <button
                            disabled={verifyEmailLoading}
                            type="submit"
                            className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-black text-sm font-medium text-white transition hover:bg-black/85 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {verifyEmailLoading ? (
                                <Spinner />
                            ) : (
                                <>
                                    Verify email
                                    <ArrowRightIcon size={18} weight="regular" />
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={resendLoading}
                        >
                            {resendLoading ? <Spinner /> : "Resend OTP"}
                        </button>
                    </form>

                    <div className="mt-8 border-t pt-6 text-center">
                        <Link
                            to="/sign-up"
                            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                        >
                            <ArrowLeftIcon size={16} weight="regular" />
                            Use a different email
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default VerifyEmail;
