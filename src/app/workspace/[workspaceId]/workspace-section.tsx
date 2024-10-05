import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import {useToggle} from "react-use"
import { cn } from "@/lib/utils";

interface WorkspaceSectionProps {
    children: React.ReactNode;
    label: string;
    hint: string;
    onNew?: () => void;
    showButton: boolean;
}

export const WorkspaceSection = ({ children, label, hint, onNew, showButton }: WorkspaceSectionProps) => {
    const [on, toggle] = useToggle(true); 

    return (
        <div className="flex flex-col mt-3 px-2">
            <div className="flex items-center px-3.5 group">
                <Button
                    variant="transparent"
                    className=" p-0.5  text-sm text-white shrink-0 size-6"
                    onClick={toggle}
                    >
                    <FaCaretDown className={cn("size-4 transition-transform",
                        on && "-rotate-90"
                    )} />

                </Button>
                <Button
                    variant="transparent"
                    size="sm"
                    className="group px-1.5 text-sm text-white h-[28px]  justify-start overflow-hidden items-center"
                >
                    <span>{label}</span>
                </Button>

                {onNew && showButton && (
                    <Hint label={hint} side="top" align="center">
                        <Button
                            onClick={onNew}
                            variant="transparent"
                            size="isonSM"
                            className="group px-1.5 text-sm text-white h-[28px]  justify-start overflow-hidden items-center"
                        >
                            <PlusIcon/>
                        </Button>
                    </Hint>
                )}
            </div>
            {on && children}
        </div>
    )
}