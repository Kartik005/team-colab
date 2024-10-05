"use client"
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    // DropdownMenuLabel,
    // DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import useCurrentUser from "../api/use-current-user"
import { Loader, LogOut } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"

const UserButton = () => {
    const { signOut } = useAuthActions();

    // user data ,image and name
    const { data, isLoading } = useCurrentUser();

    if (isLoading) {
        return (
            <Loader className="size-4 animate-spin text-muted-foreground">
            </Loader>
        )
    }
    if (!data) {
        return null;
    }

    const { name } = data;
    // const { image, name } = data;

    const avatarFallback = name!.charAt(0).toUpperCase();
    

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outline-none relative">
                {/* avatar here */}
                <Avatar className="size-10 hover:opacity-75 transition">
                    <AvatarImage />
                    <AvatarFallback className="bg-red-500 text-white">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>


                <DropdownMenuContent>
                    {/* log out button */}
                    <DropdownMenuItem
                        onClick={() => signOut()}
                        className="h-10">
                        <LogOut className="size-4 mr-2" />
                        Log Out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenuTrigger>
        </DropdownMenu>
    )
}

export default UserButton