"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import AutoPlay from "embla-carousel-autoplay";
import messages from "@/messages.json";

const Home = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 scrollbar-none">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Conversations.
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Explore Mystery Message - Where your identity remains a secret.
          </p>
        </section>

        <Carousel
          plugins={[AutoPlay({ delay: 2000 })]}
          className="w-full max-w-[12rem] sm:max-w-xs"
        >
          <CarouselContent>
            {messages.map((items) => (
              <CarouselItem key={items.id}>
                <div className="p-1">
                  <Card>
                    <CardHeader>{items.title}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        {items.content}
                      </span>
                    </CardContent>
                    <CardFooter>{items.received}</CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>

      <footer className="flex items-center justify-center mb-1">
        © 2026 mysMSG. All rights reserved.
      </footer>
    </>
  );
};

export default Home;
