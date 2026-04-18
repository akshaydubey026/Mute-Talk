'use client';

import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'usehooks-ts';
import * as z from 'zod';

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
import axios, { AxiosError } from 'axios';
import { Loader2, CheckCircle2, XCircle, MessageCircle, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';

export default function SignUpForm() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounce(username, 300);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      toast({
        title: 'Account Created!',
        description: response.data.message,
      });

      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error('Error during sign-up:', error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage =
        axiosError.response?.data.message ??
        'There was a problem with your sign-up. Please try again.';

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-violet w-96 h-96 -top-20 -right-20 opacity-50" />
      <div className="orb orb-indigo w-80 h-80 bottom-10 -left-20 opacity-40" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Mute Talk</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">
              Create your account
            </h1>
            <p className="text-white/40">
              Start your anonymous adventure. It's completely free.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Username */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 text-sm">Username</FormLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setUsername(e.target.value);
                        }}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 rounded-xl h-11 pr-10"
                        placeholder="Choose a username"
                      />
                      {isCheckingUsername && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                        </div>
                      )}
                      {!isCheckingUsername && usernameMessage && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {usernameMessage === 'Username is unique' ? (
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-400" />
                          )}
                        </div>
                      )}
                    </div>
                    {!isCheckingUsername && usernameMessage && (
                      <p
                        className={`text-xs mt-1 flex items-center gap-1 ${
                          usernameMessage === 'Username is unique'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {usernameMessage}
                      </p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 text-sm">Email</FormLabel>
                    <Input
                      {...field}
                      name="email"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 rounded-xl h-11"
                      placeholder="Enter your email"
                    />
                    <p className="text-xs text-white/30 mt-1">
                      We'll send you a verification code
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 text-sm">Password</FormLabel>
                    <Input
                      type="password"
                      {...field}
                      name="password"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 rounded-xl h-11"
                      placeholder="Create a password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 font-semibold rounded-xl gap-2 mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p className="text-white/40 text-sm">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
