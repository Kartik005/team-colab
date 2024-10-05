import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "./ui/tooltip"
/* eslint-disable @typescript-eslint/no-explicit-any */
interface EmojiPopoverProps {
    children: React.ReactNode;
    hint?: string;
    onEmojiSelect: (emoji: any) => void;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export const EmojiPopover = ({ children, hint = "Emoji", onEmojiSelect }: EmojiPopoverProps) => {

    const [popoverOpen, setPopoverOpen] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const onSelect = (emoji : any) =>{
        onEmojiSelect(emoji);
        setPopoverOpen(false);

        setTimeout( ()=>{
            setTooltipOpen(false);
        }, 500)
    }
/* eslint-enable @typescript-eslint/no-explicit-any */
    return (
        <TooltipProvider>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip open={tooltipOpen}
                    onOpenChange={setTooltipOpen}
                    delayDuration={50}>

                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                            {children}
                        </TooltipTrigger>
                    </PopoverTrigger>
                        <TooltipContent className="bg-white text-[#121212] border border-white/5">
                            <p className="font-medium text-xs">{hint}</p>
                        </TooltipContent>
                </Tooltip>
                <PopoverContent className="p-0 w-full border-none shadow-none">

                    {/* emoji picker here */}
                    <Picker data={data} onEmojiSelect={ onSelect}/>
                </PopoverContent>
            </Popover>

        </TooltipProvider>
    )
}