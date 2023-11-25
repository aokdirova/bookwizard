"use client";
import { useMutation } from "@tanstack/react-query";
import { cn } from "../lib/utils";
import { FC, HTMLAttributes, useState } from "react";
import { nanoid } from "nanoid";
import { Message } from "../lib/validators/message";

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput: FC<ChatInputProps> = ({ className, ...props }) => {
  const [input, setInput] = useState<string>("");

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (message: Message) => {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [message] }),
      });
      return response.body;
    },
    onSuccess: () => {
      console.log("success");
    },
  });

  return (
    <>
      <div {...props} className={cn("border-t border-zinc-300", className)}>
        <div className="relative mt-4 flex flex-row overflow-hidden rounded-lg border-none outline-none">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            autoFocus
            placeholder="Write a message..."
            className="focus:ring-5 peer block w-full resize-none bg-zinc-100 py-1.5  text-sm text-gray-900 sm:leading-6"
          />
          <button
            className="ml-3 rounded border border-zinc-300"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              const message: Message = {
                id: nanoid(),
                text: input,
                isUserMessage: true,
              };
              sendMessage(message);
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatInput;
