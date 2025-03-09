"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import React, {useEffect, useRef} from "react";
import {ChatRequestOptions, UIMessage} from "ai";

interface ChatProps {
    messages: UIMessage[];
    input: string;
    handleInputChange: (e: (React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>)) => void
    handleSubmit: (event?: { preventDefault?: () => void }, chatRequestOptions?: ChatRequestOptions) => void
    status: "streaming" | "submitted" | "ready" | "error";
}

export default function Chat({messages, input, handleInputChange, handleSubmit, status}: ChatProps) {

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
        }
    }

    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    useEffect(() => {
        scrollToBottom();
        focusInput();
    }, [messages, status])

    return (
        <div className="flex flex-col h-full w-full border rounded-md overflow-hidden">
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 1 && (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">Start a conversation</div>
                )}

                {messages.filter((_message, index) => index !== 0).map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                            }`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}

                {/*{status === "streaming" && (*/}
                {/*    <div className="flex justify-start">*/}
                {/*        <div className="max-w-[80%] p-3 rounded-lg bg-muted">*/}
                {/*            <div className="flex space-x-2">*/}
                {/*                <div*/}
                {/*                    className="w-2 h-2 rounded-full animate-bounce"*/}
                {/*                    style={{ animationDelay: "0ms" }}*/}
                {/*                ></div>*/}
                {/*                <div*/}
                {/*                    className="w-2 h-2 rounded-full animate-bounce"*/}
                {/*                    style={{ animationDelay: "150ms" }}*/}
                {/*                ></div>*/}
                {/*                <div*/}
                {/*                    className="w-2 h-2 rounded-full animate-bounce"*/}
                {/*                    style={{ animationDelay: "300ms" }}*/}
                {/*                ></div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>

            <div className="border-t p-3">
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-grow"
                        disabled={status === "streaming"}
                        ref={inputRef}
                    />
                    <Button type="submit" size="icon" disabled={status === "streaming" || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    )
}

