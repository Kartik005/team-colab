"use client"
//  tooltip to provide hover messages
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@radix-ui/react-tooltip"

interface HintProps{
    label : string;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start"| "center" | "end";
}

export const Hint = ({ label, children, side, align } : HintProps) =>{
    return(
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align} 
                className="bg-white text-black border border-white/5 p-2 ">
                    <p className="font-medium text-xs">
                        {label}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}