'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import {
  Loader2,
  RefreshCcw,
  Copy,
  Check,
  MessageSquare,
  LinkIcon,
  Bell,
  BellOff,
  Inbox,
} from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import Navbar from '@/components/Navbar';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed!',
            description: 'Showing your latest messages.',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white/40">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { username } = session.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Link Copied!',
      description: 'Your profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow px-4 py-10">
        <div className="container mx-auto max-w-5xl">

          {/* Header */}
          <div className="mb-10 fade-in-up">
            <h1 className="text-4xl font-black text-white mb-2">
              Welcome back,{' '}
              <span className="gradient-text">@{username}</span>
            </h1>
            <p className="text-white/40">
              Manage your anonymous messages and customize your profile.
            </p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <div className="glass rounded-2xl p-4 text-center">
              <div className="text-3xl font-black gradient-text">{messages.length}</div>
              <div className="text-sm text-white/40 mt-1">Total Messages</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <div className={`text-3xl font-black ${acceptMessages ? 'text-green-400' : 'text-red-400'}`}>
                {acceptMessages ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-white/40 mt-1">Accepting Messages</div>
            </div>
            <div className="glass rounded-2xl p-4 text-center col-span-2 md:col-span-1">
              <div className="text-3xl font-black text-purple-400">∞</div>
              <div className="text-sm text-white/40 mt-1">Privacy Level</div>
            </div>
          </div>

          {/* Profile Link Section */}
          <div className="glass rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <LinkIcon className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Your Anonymous Link</h2>
                <p className="text-xs text-white/40">Share this link to receive anonymous messages</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 font-mono truncate">
                {profileUrl}
              </div>
              <Button
                onClick={copyToClipboard}
                className={`shrink-0 gap-2 transition-all duration-300 ${
                  copied
                    ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/20'
                    : 'bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30'
                } border`}
                variant="ghost"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Accept Messages Toggle */}
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  {acceptMessages ? (
                    <Bell className="h-4 w-4 text-green-400" />
                  ) : (
                    <BellOff className="h-4 w-4 text-red-400" />
                  )}
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Message Reception
                  </h2>
                  <p className="text-xs text-white/40">
                    {acceptMessages
                      ? 'You are currently accepting new messages'
                      : 'You have paused incoming messages'}
                  </p>
                </div>
              </div>
              <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          </div>

          <Separator className="bg-white/5 mb-8" />

          {/* Messages Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Your Messages</h2>
                <p className="text-xs text-white/40">
                  {messages.length} anonymous message{messages.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-white/50 hover:text-white hover:bg-white/5 border border-white/10"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {messages.map((message) => (
                <MessageCard
                  key={message._id}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl p-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Inbox className="h-8 w-8 text-white/20" />
              </div>
              <h3 className="text-lg font-semibold text-white/40 mb-2">No messages yet</h3>
              <p className="text-white/25 text-sm">
                Share your link and wait for anonymous messages to roll in.
              </p>
              <Button
                onClick={copyToClipboard}
                className="mt-6 bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 gap-2"
                variant="ghost"
              >
                <Copy className="h-4 w-4" />
                Copy Your Link
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserDashboard;
