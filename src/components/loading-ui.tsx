import { Spinner } from "./ui/spinner";

function LoadingUi() {
    return (
        <div className="flex min-h-75 items-center justify-center">
            <Spinner />
        </div>
    );
}

export default LoadingUi;
