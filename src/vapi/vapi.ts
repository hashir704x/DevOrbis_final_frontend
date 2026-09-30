import VapiPackage from "@vapi-ai/web";

const Vapi = (VapiPackage as any).default;

const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
if (!publicKey) {
  throw new Error("VITE_VAPI_PUBLIC_KEY is not configured in env");
}
if (!assistantId) {
  throw new Error("VITE_VAPI_ASSISTANT_ID is not configured in env");
}

export const vapiClient = new Vapi(publicKey);


export function startVoiceCall(userId: string) {
  return vapiClient.start(assistantId, {
    variableValues: {
      "user_id": userId,
    },
  });
}
