import { ChatRequestOptions, UIMessage } from 'ai'
import React from 'react'
import { create } from 'zustand'
import { Message } from '@ai-sdk/react'

interface ChatState {
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
    setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void;
}

export const useChatStore = create<ChatState>(() => {
    return {
        messages: [],
        input: '',
        handleInputChange: () => {},
        handleSubmit: () => {},
        status: 'ready',
        setMessages: () => {}
    }
})
