'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, ArrowRight, Shield, Zap, Users, Star, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import Navbar from '@/components/Navbar';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const features = [
  {
    icon: Shield,
    title: 'Completely Anonymous',
    description: 'Your identity is never revealed. Send and receive messages with full privacy guaranteed.',
  },
  {
    icon: Zap,
    title: 'Instant Delivery',
    description: 'Messages are delivered in real-time. No delays, no complications.',
  },
  {
    icon: Users,
    title: 'Share Your Link',
    description: 'Get a unique link and share it anywhere. Anyone can message you anonymously.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden py-24 md:py-36 px-4">
          {/* Background orbs */}
          <div className="orb orb-purple w-96 h-96 -top-20 -left-20 opacity-60" />
          <div className="orb orb-indigo w-80 h-80 top-40 -right-20 opacity-50" />
          <div className="orb orb-violet w-64 h-64 bottom-0 left-1/3 opacity-40" />

          <div className="relative container mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-strong text-sm text-purple-300 mb-8 fade-in-up">
              <Star className="h-3.5 w-3.5 fill-purple-400 text-purple-400" />
              Anonymous messaging, reinvented
              <ChevronRight className="h-3.5 w-3.5" />
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 fade-in-up fade-in-up-delay-1">
              <span className="text-white">Say It</span>{' '}
              <span className="gradient-text">Without</span>
              <br />
              <span className="text-white">Saying Who You Are</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up fade-in-up-delay-2">
              Mute Talk lets you send anonymous messages to anyone. Speak freely, 
              share honestly, and get real feedback — all without revealing your identity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 fade-in-up fade-in-up-delay-3">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="h-12 px-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 shadow-2xl shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105 gap-2 text-base font-semibold"
                >
                  Get Your Link Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  variant="ghost"
                  className="h-12 px-8 glass hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all duration-300 text-base"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-white/30">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full border-2 border-black/50 bg-gradient-to-br from-violet-500 to-purple-700"
                      style={{ opacity: 1 - i * 0.1 }}
                    />
                  ))}
                </div>
                <span>10k+ users</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1">4.9 rating</span>
              </div>
              <span>🔒 End-to-end private</span>
            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="py-16 px-4 bg-white/[0.02] border-y border-white/5">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                See What People Are Saying
              </h2>
              <p className="text-white/40">Real anonymous messages from real people</p>
            </div>

            <Carousel
              plugins={[Autoplay({ delay: 3000 })]}
              className="w-full max-w-xl mx-auto"
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index} className="p-2">
                    <div className="glass-strong rounded-2xl p-6 hover-card">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white mb-1">{message.title}</h3>
                          <p className="text-white/70 text-sm leading-relaxed">{message.content}</p>
                          <p className="text-white/30 text-xs mt-2">{message.received}</p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose Mute Talk?
              </h2>
              <p className="text-white/40 max-w-xl mx-auto">
                Everything you need for genuine, anonymous conversations in one place.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl p-6 hover-card group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-700/20 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:from-violet-500/30 group-hover:to-purple-700/30 transition-all duration-300">
                    <feature.icon className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <div className="relative glass-strong rounded-3xl p-12 overflow-hidden">
              <div className="orb orb-purple w-64 h-64 -top-20 -right-20 opacity-40" />
              <div className="orb orb-indigo w-48 h-48 -bottom-16 -left-16 opacity-30" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Ready to Start?
                </h2>
                <p className="text-white/50 mb-8 max-w-md mx-auto">
                  Create your free account and get your personal anonymous message link in seconds.
                </p>
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="h-12 px-10 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white border-0 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 gap-2 font-semibold"
                  >
                    Create Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <Mail className="h-3 w-3 text-white" />
            </div>
            <span className="text-white/40 text-sm">Mute Talk</span>
          </div>
          <p className="text-white/30 text-sm">
            © 2024 Mute Talk. All rights reserved. Your privacy, always.
          </p>
          <div className="flex items-center gap-4 text-white/30 text-sm">
            <Link href="/sign-in" className="hover:text-white/60 transition-colors">Sign In</Link>
            <Link href="/sign-up" className="hover:text-white/60 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
