import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const SidebarItemVariants = cva(
    "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text text-sm overflow-hidden",
    {
        variants:{
            variant: {
                default: "text-white",
                active: "text-[#481349] bg-white/90 hover:bg-white/90"
            },
        },
        defaultVariants:{
            variant: "default",
        },
    },
);

interface SidebarItemProps {
    label: string;
    id: string;
    icon: LucideIcon | IconType;
    variant?: VariantProps<typeof SidebarItemVariants>["variant"];
}

export const SidebarItem = ({label, id, icon : Icon, variant} : SidebarItemProps) =>{

    const workspaceId = useWorkspaceId();

    return(
        <Button
        variant="transparent"
        size="sm"
        className={cn( SidebarItemVariants({variant: variant}))}
        asChild // make it an anchor tag
        >
            <Link href={`/workspace/${workspaceId}/channel/${id}`}>
            <Icon className="size-3.5 mr-1 shrink-0"/>
            <span className="text-sm truncate">{label}</span>
            </Link>
        </Button>
    )
}