'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { MessageCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    setIsSubmitting(false);

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-purple w-96 h-96 -top-20 -left-20 opacity-50" />
      <div className="orb orb-indigo w-80 h-80 bottom-0 -right-20 opacity-40" />

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
              Welcome back
            </h1>
            <p className="text-white/40">
              Sign in to continue your secret conversations.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 text-sm">Email or Username</FormLabel>
                    <Input
                      {...field}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 rounded-xl h-11"
                      placeholder="Enter your email or username"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white/60 text-sm">Password</FormLabel>
                    <Input
                      type="password"
                      {...field}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50 rounded-xl h-11"
                      placeholder="Enter your password"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-purple-500/40 font-semibold rounded-xl gap-2 mt-2"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6">
            <p className="text-white/40 text-sm">
              New to Mute Talk?{' '}
              <Link href="/sign-up" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
