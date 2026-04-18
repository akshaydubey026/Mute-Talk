'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Sparkles, Send, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar).filter((m) => m.trim().length > 0);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-purple w-80 h-80 -top-20 -left-20 opacity-50" />
      <div className="orb orb-indigo w-72 h-72 bottom-20 -right-20 opacity-40" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">Mute Talk</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow px-4 py-12">
        <div className="container mx-auto max-w-2xl">

          {/* Hero */}
          <div className="text-center mb-10 fade-in-up">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
              Send a message to{' '}
              <span className="gradient-text">@{username}</span>
            </h1>
            <p className="text-white/40 text-sm">
              Your identity will remain completely anonymous.
            </p>
          </div>

          {/* Message Form */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 mb-6 fade-in-up">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/60 text-sm">Your Anonymous Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What do you want to say anonymously? Be kind, be honest..."
                          className="resize-none bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 rounded-xl min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  {isLoading ? (
                    <Button
                      disabled
                      className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isLoading || !messageContent}
                      className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>

          {/* Suggested Messages */}
          <div className="glass rounded-2xl p-6 mb-8 fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-white">Suggested Messages</h3>
                <p className="text-xs text-white/40 mt-0.5">Click to use one of these messages</p>
              </div>
              <Button
                onClick={fetchSuggestedMessages}
                disabled={isSuggestLoading}
                size="sm"
                variant="ghost"
                className="gap-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/20"
              >
                {isSuggestLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5" />
                )}
                {isSuggestLoading ? 'Generating...' : 'Suggest'}
              </Button>
            </div>

            {error ? (
              <p className="text-red-400 text-sm">{error.message}</p>
            ) : (
              <div className="flex flex-col gap-2">
                {parseStringMessages(completion).map((message, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleMessageClick(message)}
                    className="text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-purple-500/10 border border-white/5 hover:border-purple-500/20 text-white/70 hover:text-white text-sm transition-all duration-200 cursor-pointer"
                  >
                    {message}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-white/5 mb-8" />

          {/* CTA */}
          <div className="text-center fade-in-up">
            <p className="text-white/40 text-sm mb-4">
              Want your own anonymous message board?
            </p>
            <Link href="/sign-up">
              <Button
                className="gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-300"
                variant="ghost"
              >
                Create Your Free Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
