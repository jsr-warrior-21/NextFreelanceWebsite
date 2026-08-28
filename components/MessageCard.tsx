"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X, Calendar } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "@/components/ui/toast";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProp = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProp) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`
      );
      toast.add({
        title: response.data.message || "Message deleted",
      });
      onMessageDelete(message._id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to delete message",
      });
    }
  };

  const formattedDate = new Date(message.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card className="relative group border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-900 rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 pt-5 px-5">
        <CardTitle className="text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed pr-6">
          {message.content}
        </CardTitle>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0"
                aria-label="Delete message"
              >
                <X className="w-4 h-4" />
              </Button>
            }
          />
          <AlertDialogContent className="bg-white dark:bg-slate-900 rounded-2xl max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                Delete Message?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 dark:text-slate-400 text-sm">
                This action cannot be undone. This message will be permanently removed from your dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4 gap-2">
              <AlertDialogCancel className="rounded-lg">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent className="px-5 pb-4 pt-2">
        <div className="flex items-center text-xs text-slate-400 dark:text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
          <span>{formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
