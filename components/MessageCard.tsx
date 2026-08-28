"use client";
import React from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
import { Button } from "@base-ui/react";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "@/components/ui/toast";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProp = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProp) => {
    
    const handleDeleteConfirm =  async() =>{
        const response  = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast.add({
            title:response.data.message
        })
        const id = message._id.toString();
        onMessageDelete(id)
    }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button >
                <X className="w-5 h-5" />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <CardDescription>Card Description</CardDescription>
        <CardAction>Card Action</CardAction>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
};

export default MessageCard;
