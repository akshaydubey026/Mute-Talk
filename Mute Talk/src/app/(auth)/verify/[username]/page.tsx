'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { MessageCircle, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: 'Account Verified!',
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Verification Failed',
        description:
          axiosError.response?.data.message ??
          'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-purple w-80 h-80 -top-10 -right-10 opacity-50" />
      <div className="orb orb-violet w-64 h-64 bottom-10 -left-10 opacity-40" />

      <div className="relative w-full max-w-md">
        <div className="glass-strong rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Mute Talk</span>
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="h-8 w-8 text-purple-400" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              Verify your email
            </h1>
            <p className="text-white/40 text-sm">
              We sent a 6-digit code to your email. Enter it below to activate your account.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 text-sm">Verification Code</FormLabel>
                    <Input
                      {...field}
                      placeholder="Enter 6-digit code"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 rounded-xl h-12 text-center text-xl tracking-widest font-mono"
                      maxLength={6}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 font-semibold rounded-xl gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p className="text-white/30 text-sm">
              Didn't receive a code?{' '}
              <Link href="/sign-up" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Try again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
