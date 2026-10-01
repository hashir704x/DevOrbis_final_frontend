function ErrorUi({
    errorMessage,
    errorDescription = "Something went wrong",
}: {
    errorMessage: string;
    errorDescription?: string;
}) {
    return (
        <div className="flex min-h-75 items-center justify-center">
            <div className="text-center">
                <h2 className="text-lg font-semibold text-black">
                    {errorDescription}
                </h2>

                <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
            </div>
        </div>
    );
}

export default ErrorUi;
