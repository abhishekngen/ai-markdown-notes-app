import React, { useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Message } from '@ai-sdk/react';
import { useNoteStore } from '@/store/notes-store';
import { ChatRequestOptions, UIMessage } from 'ai';
import { generateAIContext } from '@/lib/utils/ai-utils';

interface ChatProps {
    messages: UIMessage[];
    input: string;
    handleInputChange: (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => void;
    handleSubmit: (
        event?: { preventDefault?: () => void },
        chatRequestOptions?: ChatRequestOptions
    ) => void;
    status: 'streaming' | 'submitted' | 'ready' | 'error';
    setMessages: (
        messages: Message[] | ((messages: Message[]) => Message[])
    ) => void;
}

export default function Chat({
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setMessages,
}: ChatProps) {
    const { currentNote } = useNoteStore();

    // On mount, just use the current note as context. On switching note whilst leaving AI tab open, switch context and do not reset.

    const id = useRef(currentNote?.id);

    useEffect(() => {
        const contextToAdd = generateAIContext(currentNote);
        if (id.current === currentNote?.id && messages?.length > 0) {
            setMessages(
                messages.map((message) => {
                    if (message.role === 'system') {
                        return {
                            id: '',
                            role: 'system',
                            content: contextToAdd,
                        };
                    } else {
                        return message;
                    }
                })
            );
        } else {
            id.current = currentNote?.id;
            setMessages([
                {
                    id: '',
                    role: 'system',
                    content: contextToAdd,
                },
            ]);
        }
    }, [currentNote?.id]);

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
    };

    const focusInput = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    useEffect(() => {
        scrollToBottom();
        focusInput();
    }, [messages, status]);

    return (
        <div className="flex flex-col h-full w-full border rounded-md overflow-hidden">
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.length === 1 && (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                        Start a conversation
                    </div>
                )}

                {messages
                    .filter((_message, index) => index !== 0)
                    .map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                    message.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-foreground'
                                }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}

                {status === 'submitted' && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] p-4 rounded-lg bg-muted">
                            <div className="flex space-x-2">
                                <div
                                    className="w-2 h-2 rounded-full animate-bounce bg-foreground"
                                    style={{ animationDelay: '0ms' }}
                                ></div>
                                <div
                                    className="w-2 h-2 rounded-full animate-bounce bg-foreground"
                                    style={{ animationDelay: '150ms' }}
                                ></div>
                                <div
                                    className="w-2 h-2 rounded-full animate-bounce bg-foreground"
                                    style={{ animationDelay: '300ms' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t p-3">
                <form onSubmit={handleSubmit} className="flex w-full space-x-2">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-grow"
                        disabled={status === 'streaming'}
                        ref={inputRef}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={status === 'streaming' || !input.trim()}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
