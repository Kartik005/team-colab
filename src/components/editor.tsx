import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css"

import { PiTextAa } from "react-icons/pi"
import { MdSend } from "react-icons/md"
import { ImageIcon, SmileIcon, XIcon } from "lucide-react";

import { Button } from "./ui/button";

import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Hint } from "./hint";
import { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import Image from "next/image";

//** quill does server side rendering, so we import our editor dynamically in chat-input.tsx


// refs don't cause rerendering when changed and they don't need to be included in the dependency array
type EditorValue = {
    image: File | null;
    body: string;
}

interface EditorProps {
    onSubmit: ({ image, body }: EditorValue) => void;
    onCancel?: () => void;
    placeholder?: string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>;
    variant?: "create" | "update";
};

const Editor = ({
    onCancel,
    onSubmit,
    placeholder = "Start typing...",
    defaultValue = [],
    disabled = false,
    innerRef,
    variant = "create" }: EditorProps) => {

    const [text, setText] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [isToolbarVisible, setIsToolbarVisible] = useState(true);


    // using refs inside useEffect as they don't cause rerender but they get updated
    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const containerRef = useRef<HTMLDivElement>(null);
    const disabledRef = useRef(disabled);
    const imageElementRef = useRef<HTMLInputElement>(null);


    useLayoutEffect(() => {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div"),
        );

        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", "strike"],
                    ["link"],
                    [{ list: "ordered" }, { list: "bullet" }],
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                // submit form
                                const text = quill.getText();
                                const addImage = imageElementRef.current?.files?.[0] || null;

                                const textEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0; // regex to remove null chars or whitespace

                                if (!addImage && textEmpty) return;

                                const body = JSON.stringify(quill.getContents());

                                submitRef.current?. ({
                                    body,  image: addImage
                                })
                                
                                return;
                            }
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n");
                            }
                        }
                    }
                }
            }
        };

        const quill = new Quill(editorContainer, options);
        quillRef.current = quill;
        quillRef.current.focus(); // autofocus

        if (innerRef) {
            innerRef.current = quill; // quill given to innerref, so we can control this from outside like from chat-input.tsx

        }

        quill.setContents(defaultValueRef.current);
        setText(quill.getText());

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        })

        return () => {
            quill.off(Quill.events.TEXT_CHANGE);
            if (container) {
                container.innerHTML = "";
            }

            if (quillRef.current) {
                quillRef.current = null;
            }

            if (innerRef) {
                innerRef.current = null;
            }
        }
    }, [innerRef])

    const toggleToolbar = () => {
        setIsToolbarVisible((visiblity) => !visiblity);
        const toolbarElement = containerRef.current?.querySelector(".ql-toolbar");

        if (toolbarElement) {
            toolbarElement.classList.toggle("hidden");
        }
    }

    const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0; // regex to remove null chars or whitespace

    // disabling rule for this block
/* eslint-disable @typescript-eslint/no-explicit-any */
    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current;

        quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
    }
/* eslint-enable @typescript-eslint/no-explicit-any */

    return (
        <div className="flex flex-col">
            <input
                type="file"
                accept="image/*"
                ref={imageElementRef}
                onChange={(e) => setImage(e.target.files![0])}
                className="hidden"
            />
            <div className={cn("flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white text-[#121212]",
                disabled && "opacity-50"
             )}>
                <div className="h-full ql-custom"
                    ref={containerRef} >
                </div>

                {!!image && (
                    <div className="p-2">
                        <div className="relative size-[62px] flex items-center justify-center group/image">
                            <Hint label="Remove image">

                                <button
                                    onClick={() => {
                                        setImage(null);
                                        imageElementRef.current!.value = "";
                                    }}
                                    className="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
                                >

                                    <XIcon className="size-3.5" />
                                </button>
                            </Hint>

                            <Image
                                src={URL.createObjectURL(image)}
                                alt="uploaded"
                                fill
                                className="rounded-xl overflow-hidden border object-cover"
                            />
                        </div>
                    </div>
                )}
                <div className="flex px-2 pb-2 z-[5]">

                    {/* lower buttons section */}
                    <Hint label={isToolbarVisible ? "Hide formatting" : "Show formatting"}>

                        <Button
                            disabled={disabled}
                            size="sm"
                            variant="ghost"
                            onClick={toggleToolbar}
                        >
                            <PiTextAa className="size-4" />
                        </Button>
                    </Hint>

                    {/* emoji button */}
                    <EmojiPopover onEmojiSelect={onEmojiSelect}>

                        <Button
                            disabled={disabled}
                            size="sm"
                            variant="ghost"
                            onClick={() => { }}
                        >

                            <SmileIcon className="size-4" />
                        </Button>
                    </EmojiPopover>


                    {/* image button */}
                    {variant === "create" && (
                        <Hint label="Image">

                            <Button
                                disabled={disabled}
                                size="sm"
                                variant="ghost"
                                onClick={() => imageElementRef?.current?.click()}
                            >
                                <ImageIcon className="size-4" />
                            </Button>
                        </Hint>
                    )}

                    {variant === "update" && (
                        <div className="ml-auto flex items-center gap-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onCancel}
                                disabled={disabled}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#005f7a] hover:bg-[#007a5a]/80 text-white"
                                size="sm"
                                onClick={() => {
                                    onSubmit({
                                        body: JSON.stringify(quillRef.current?.getContents()),
                                        image,
                                    })
                                }}
                                disabled={disabled || isEmpty}
                            >
                                Save
                            </Button>
                        </div>
                    )}

                    {/* send button */}
                    {variant === "create" && (
                        <Button
                            disabled={disabled || isEmpty}
                            onClick={() => {
                                onSubmit({
                                    body: JSON.stringify(quillRef.current?.getContents()),
                                    image,
                                })
                            }}
                            size="isonSM"
                            className={cn("ml-auto",
                                isEmpty
                                    ? " bg-white hover:bg-white text-muted-foreground"
                                    : " bg-[#005f7a] hover:bg-[#007a5a]/80 text-white"
                            )}>
                            <MdSend className="size-4" />
                        </Button>
                    )}
                </div>

            </div>
            {variant === "create" && (
                <div className={cn("p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
                    !isEmpty && "opacity-100"
                )}>
                    <p>
                        <strong>Shift + Return</strong> to add a new line
                    </p>
                </div>

            )}
        </div>
    )
}

export default Editor