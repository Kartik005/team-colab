import { useMutation } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { useCallback, useMemo, useState } from "react";
// import { Id } from "../../../../convex/_generated/dataModel";

type ResponseType = string| null;

type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
    throwError?: boolean;
}

export const useGenerateUploadUrl = () => {

    const [data, setData] = useState<ResponseType>(null);
    const [error, setError] = useState<Error | null>(null);

    // resolves state conflicts
    // this way only one state will be "true"
    const [status, setStatus] = useState<"success" | "error" | "pending" | "settled" | null>(null);

    const isPending = useMemo(()=> status === "pending", [status]);
    const isSuccess = useMemo(()=> status === "success", [status]);
    const isSettled = useMemo(()=> status === "settled", [status]);
    const isError = useMemo(()=> status === "error", [status]);

    const mutation = useMutation(api.upload.generatedUploadUrl);

    const mutate = useCallback(async (values: {}, options?: Options) => {
        try {
            setData(null);
            setError(null);
            setStatus("pending");

            const response = await mutation();
            options?.onSuccess?.(response);

            return response;
        }
        catch (error) {
            setStatus("error");
            options?.onError?.(error as Error);

            if (options?.throwError) {
                throw error;
            }
        }
        finally {
            setStatus("settled");
            options?.onSettled?.();
        }
    }, [mutation]);

    return {
        mutate,
        data,
        error,
        isPending,
        isSettled,
        isSuccess,
        isError
    };
}