"use client";
import { useParams } from "next/navigation";
import { MessagesHeader } from "./MessagesHeader";
import { MessageInput } from "./MessageInput";
import { useMessages } from "@/hooks/chat/message/useMessages";
import { useConversation } from "@/hooks/chat/conversation/useConversation";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useEffect, useState } from "react";
import { MessageList } from "./MessageList";
import { useSocketMessages } from "@/hooks/useSocketMessages";
import { MessageResponse } from "@/types/message";
import { conversationResponse } from "@/types/conversation";
export function MessageContainer() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const [selectedConversation, setSelectedConversation] =
    useState<conversationResponse | null>(null);

  const {
    isConnected,
    subscribeNewMessage,
  } = useSocketMessages();

  const {
    loading: conversationLoading,
    error,
    getConversationById,
  } = useConversation();

  const { messages, loading, loadMore, pagination, addNewMessage } =
    useMessages(conversationId);

  console.log("loading", conversationId);

  // useEffect(() => {
  //   if (!isConnected || !conversationId) return;

  //   console.log("Joining conversation:", conversationId);
  //   joinConversation(conversationId);

  //   return () => {
  //     console.log("Leaving conversation:", conversationId);
  //     leaveConversation(conversationId);
  //   };
  // }, [conversationId, isConnected, joinConversation, leaveConversation]);

  const handleNewMessage = useCallback(
    (newMessage: MessageResponse) => {
      addNewMessage(newMessage, conversationId);
    },
    [addNewMessage, conversationId]
  );

  useEffect(() => {
    if (!isConnected || !conversationId) return;
    const unsubscribeNewMessage = subscribeNewMessage(handleNewMessage);
    return () => {
      unsubscribeNewMessage();
    };
  }, [isConnected, conversationId, subscribeNewMessage, handleNewMessage]);

  useEffect(() => {
    if (!conversationId) return;

    const fetchConversation = async () => {
      try {
        const conversation = await getConversationById(conversationId);
        setSelectedConversation(conversation);
      } catch (error) {
        console.error("Failed to fetch conversation:", error);
        setSelectedConversation(null);
      }
    };

    fetchConversation();
  }, [conversationId]);

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        {" "}
        <div className="text-center">
          {" "}
          <p className="text-red-600">Error loading conversation</p>{" "}
        </div>{" "}
      </div>
    );
  }

  if (conversationLoading || !conversationId) {
    return (
      <div className="h-full flex flex-col">
        {" "}
        {/* Header Skeleton */}{" "}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <Skeleton className="h-10 w-10 rounded-full" />{" "}
            <div className="space-y-2">
              {" "}
              <Skeleton className="h-4 w-32" />{" "}
              <Skeleton className="h-3 w-24" />{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex gap-2">
            {" "}
            <Skeleton className="h-9 w-9 rounded-md" />{" "}
            <Skeleton className="h-9 w-9 rounded-md" />{" "}
            <Skeleton className="h-9 w-9 rounded-md" />{" "}
          </div>{" "}
        </div>{" "}
        {/* Message List Skeleton */}{" "}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {" "}
          {/* Date separator skeleton */}{" "}
          <div className="flex justify-center">
            {" "}
            <Skeleton className="h-6 w-32 rounded-full" />{" "}
          </div>{" "}
          {/* Incoming messages */}{" "}
          <div className="flex gap-2">
            {" "}
            <Skeleton className="h-8 w-8 rounded-full mt-1" />{" "}
            <div className="space-y-2">
              {" "}
              <Skeleton className="h-4 w-24" />{" "}
              <Skeleton className="h-12 w-64 rounded-2xl rounded-bl-md" />{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex gap-2">
            {" "}
            <Skeleton className="h-8 w-8 rounded-full mt-1" />{" "}
            <div className="space-y-2">
              {" "}
              <Skeleton className="h-4 w-24" />{" "}
              <Skeleton className="h-16 w-72 rounded-2xl rounded-bl-md" />{" "}
            </div>{" "}
          </div>{" "}
          {/* Date separator skeleton */}{" "}
          <div className="flex justify-center">
            {" "}
            <Skeleton className="h-6 w-32 rounded-full" />{" "}
          </div>{" "}
          {/* Outgoing messages */}{" "}
          <div className="flex gap-2 justify-end">
            {" "}
            <div className="space-y-2">
              {" "}
              <Skeleton className="h-10 w-52 rounded-2xl rounded-br-md" />{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex gap-2 justify-end">
            {" "}
            <div className="space-y-2">
              {" "}
              <Skeleton className="h-16 w-60 rounded-2xl rounded-br-md" />{" "}
            </div>{" "}
          </div>{" "}
          <div className="flex gap-2 justify-end">
            {" "}
            <div className="space-y-2">
              {" "}
              <Skeleton className="h-8 w-40 rounded-2xl rounded-br-md" />{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* Message Input Skeleton */}{" "}
        <div className="p-4 border-t bg-white">
          {" "}
          <div className="flex items-center gap-2">
            {" "}
            <Skeleton className="h-9 w-9 rounded-md" />{" "}
            <Skeleton className="h-9 w-9 rounded-md" />{" "}
            <Skeleton className="h-10 flex-1 rounded-full" />{" "}
            <Skeleton className="h-9 w-9 rounded-md" />{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-blue-50/30">
      <MessagesHeader
        conversation={selectedConversation}
        isConnected={isConnected}
      />
      <MessageList
        messages={messages}
        onLoadMore={loadMore}
        hasMore={pagination?.page! < pagination?.totalPages!}
        loading={loading}
      />
      <MessageInput
        conversationId={conversationId}
        disabled={loading || !isConnected}
      />{" "}
    </div>
  );
}
