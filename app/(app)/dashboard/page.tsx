"use client";

import { Message } from "@/model/User";
import { useCallback, useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useSession } from "next-auth/react";
import MessageCard from "@/components/MessageCard";
import { Loader2, RefreshCcw, Copy, ExternalLink, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { User } from "next-auth";
import Link from "next/link";

const Page = () => {
  const { data: session, status } = useSession();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m._id.toString() !== messageId));
  };

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessage");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-message");
      setValue("acceptMessage", response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-message");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast.add({
            title: "Refreshed Messages",
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.add({
          title: "Error",
          description:
            axiosError.response?.data.message ||
            "Failed to fetch messages",
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user) return;

    fetchMessages();
    fetchAcceptMessage();

    if (typeof window !== "undefined" && session.user) {
      const { username } = session.user as User;
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${username}`);
    }
  }, [session, status, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });

      setValue("acceptMessage", !acceptMessages);

      toast.add({
        title: response.data.message || "Message acceptance updated",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to update message settings",
      });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-slate-900 dark:text-white" />
        <p className="font-medium text-sm">Loading Dashboard...</p>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
          Please log in to view your dashboard.
        </p>
        <Link href="/sign-in">
          <Button className="rounded-xl px-6">Sign In</Button>
        </Link>
      </div>
    );
  }

  const copyToClipboard = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      toast.add({
        title: "URL Copied!",
        description: "Your unique profile link has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 md:p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 w-full max-w-6xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
            User Dashboard
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Manage your public profile link, message preferences, and inbox
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
          disabled={isLoading}
          className="rounded-xl flex items-center gap-2 border-slate-300 dark:border-slate-700"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
          Refresh Messages
        </Button>
      </div>

      {/* Unique Profile Link Section */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          Copy Your Unique Public Link
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Button
              onClick={copyToClipboard}
              className="w-full sm:w-auto rounded-xl flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>
            {profileUrl && (
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl flex items-center gap-2 border-slate-300 dark:border-slate-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Link
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Acceptance Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <Switch
            {...register("acceptMessage")}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            Accept Messages:{" "}
            <span
              className={
                acceptMessages
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-red-500 font-bold"
              }
            >
              {acceptMessages ? "ON" : "OFF"}
            </span>
          </span>
        </div>
      </div>

      <Separator />

      {/* Messages Inbox */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Received Messages ({messages.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard
                key={message._id.toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <p className="font-medium text-sm">No messages received yet.</p>
              <p className="text-xs mt-1 text-slate-500">
                Share your public link to start receiving anonymous messages!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
