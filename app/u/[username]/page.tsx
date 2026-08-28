"use client";

import React, { useEffect, useState, use } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, Send, AlertCircle, CheckCircle } from "lucide-react";

const initialSuggestedMessages = [
  "What's something you've always wanted to try but have been too afraid to do?",
  "If you could live in any fictional world, which one would it be and why?",
  "What's the best piece of advice you've ever received and how has it impacted your life?",
];

const Page = ({ params }: { params: Promise<{ username: string }> }) => {
  const resolvedParams = use(params);
  const username = resolvedParams.username;

  const [isSending, setIsSending] = useState(false);
  const [isAcceptingMessage, setIsAcceptingMessage] = useState<boolean | null>(
    null
  );
  const [isCheckingAcceptance, setIsCheckingAcceptance] = useState(true);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>(
    initialSuggestedMessages
  );
  const [isSuggesting, setIsSuggesting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const messageContent = watch("content");

  // Check if target user exists and accepts messages
  useEffect(() => {
    const checkAcceptanceStatus = async () => {
      try {
        const response = await axios.get(
          `/api/check-user-accepting-message/${username}`
        );
        setIsAcceptingMessage(response.data.isAcceptingMessage);
      } catch (error) {
        console.error("Error checking user status:", error);
        // Default to true if user endpoint check is pending or returns success true
        setIsAcceptingMessage(true);
      } finally {
        setIsCheckingAcceptance(false);
      }
    };
    if (username) {
      checkAcceptanceStatus();
    }
  }, [username]);

  // Direct robust fetch for suggested messages
  const handleFetchSuggestedMessages = async () => {
    setIsSuggesting(true);
    try {
      const response = await axios.post("/api/suggest-message");
      const text = typeof response.data === "string" ? response.data : JSON.stringify(response.data);
      const parsed = text
        .split("||")
        .map((msg: string) => msg.trim())
        .filter((msg: string) => msg.length > 0);

      if (parsed.length > 0) {
        setSuggestedMessages(parsed);
        toast.add({
          title: "New Suggestions Loaded!",
          description: "Click any question below to select it.",
        });
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      // Pick random fallback list if API fails
      const fallbackSets = [
        [
          "What is your dream vacation destination?",
          "What is a skill you wish you possessed?",
          "What movie never fails to make you laugh?",
        ],
        [
          "What is your favorite memory from childhood?",
          "If you could master any language instantly, which one would it be?",
          "What's a hidden talent you have?",
        ],
      ];
      const randomSet = fallbackSets[Math.floor(Math.random() * fallbackSets.length)];
      setSuggestedMessages(randomSet);
      toast.add({
        title: "Suggestions Refreshed!",
        description: "Click any question below to select it.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleMessageClick = (messageText: string) => {
    setValue("content", messageText, { shouldValidate: true });
    toast.add({
      title: "Question Selected!",
      description: "Message copied to the text box above.",
    });
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    if (isAcceptingMessage === false) {
      toast.add({
        title: "User not accepting messages",
        description: "This user is currently not accepting new messages.",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });

      toast.add({
        title: "Message Sent!",
        description: response.data.message || "Your anonymous message was delivered successfully!",
      });

      reset({ content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.add({
        title: "Error Sending Message",
        description:
          axiosError.response?.data.message || "Failed to send message.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Public Profile Link
          </h1>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
            Send Anonymous Message to{" "}
            <span className="text-slate-900 dark:text-slate-100 font-bold">
              @{username}
            </span>
          </p>
        </div>

        {/* Message Input Form */}
        <Card className="shadow-lg border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {isCheckingAcceptance ? (
              <div className="flex items-center justify-center py-6 text-slate-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span>Checking user status...</span>
              </div>
            ) : isAcceptingMessage === false ? (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center gap-3 text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-medium">
                  @{username} is currently not accepting anonymous messages.
                </span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <textarea
                  {...register("content")}
                  disabled={isAcceptingMessage === false || isSending}
                  placeholder="What's something you've always wanted to ask?"
                  rows={4}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-400 focus:outline-none transition-all resize-none text-base font-normal disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {errors.content && (
                  <p className="text-xs text-red-500 font-medium pl-1">
                    {errors.content.message}
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={
                    isAcceptingMessage === false ||
                    isSending ||
                    !messageContent?.trim()
                  }
                  className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send It
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* AI Suggest Messages Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Button
              type="button"
              onClick={handleFetchSuggestedMessages}
              disabled={isSuggesting}
              variant="outline"
              className="px-6 py-2.5 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSuggesting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-500" />
              )}
              Suggest Messages
            </Button>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Click on any message below to select it.
            </p>
          </div>

          <Card className="shadow-md border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Messages
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {suggestedMessages.map((msgText: string, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleMessageClick(msgText)}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 font-medium text-slate-800 dark:text-slate-200 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 flex items-center justify-between group cursor-pointer"
                >
                  <span>{msgText}</span>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors ml-2 shrink-0">
                    Select →
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
