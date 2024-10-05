import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"



const useCurrentUser = () => {
    // const data = useQuery(api.users.current) // current not present now
    const data = useQuery(api.users.default)
    const isLoading = data === undefined;
    
    return {data, isLoading};
}

export default useCurrentUser