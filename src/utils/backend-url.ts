const BACKEND_URL: string = import.meta.env.VITE_BACKEND_URL;
if (!BACKEND_URL) {
  throw new Error("BACKEND URL not found in env");
}
export { BACKEND_URL };
