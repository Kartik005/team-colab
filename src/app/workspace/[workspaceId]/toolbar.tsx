import { Button } from "@/components/ui/button"
import useGetWorkSpace from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Info, Search } from "lucide-react"

// not using this module any longer
export const Toolbar = () => {

    const workspaceId = useWorkspaceId();

    const {data} = useGetWorkSpace({ id : workspaceId}); // no problem calling this again, it gets cached
    return (
        <nav className="bg-[#E3E1ED] flex items-center justify-between h-10 p-1.5">
            <div className="flex-1"></div>
                <div className="min-w-[280px] max-[642px] grow-[2] shrink">
                    <Button size="sm" className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2">
                        <Search />
                        <span className="text-xs">
                            Search <strong>{data?.name}</strong>
                        </span>
                    </Button>
                </div>
                <div className="ml-auto flex-1 flex items-center justify-end">
                    <Button variant="transparent" size="isonSM">
                        <Info className="size-5"/>
                         
                    </Button>
                </div>
        </nav>
    )
}