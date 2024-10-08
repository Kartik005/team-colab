import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";



const useGetWorkSpaces = () => {
    const data = useQuery(api.workspaces.get);
    const isLoading = data === undefined;

    return {data, isLoading};
}

export default useGetWorkSpaces