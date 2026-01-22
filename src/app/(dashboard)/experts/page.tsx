"use client";
export const dynamic = 'force-dynamic';
import Image from "next/image";
import Link from "next/link";
import Providers from "@/components/layout/providers";
import Header from "@/components/layout/header";
import DashboardNav from "@/components/layout/nav";
import Card, { CardContent } from "@/components/ui/card";
import { getMascotList } from "@/lib/mascots";

export default function ExpertsPage() {
  const experts = getMascotList();

  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 pb-24 md:pb-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Experts</h1>
            <p className="text-gray-600">
              Meet the specialists behind No Prior Authorization. Choose who you
              want to ask and jump straight into the chat.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {experts.map((expert) => (
              <Card key={expert.id}>
                <CardContent className="p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-200 bg-white">
                      <Image
                        src={expert.image}
                        alt={expert.imageAlt}
                        width={128}
                        height={128}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{expert.name}</h2>
                      <p className="text-sm text-gray-600">{expert.role}</p>
                      {expert.credentials && (
                        <p className="text-sm font-semibold text-pink-500">
                          {expert.credentials}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    Focus: {expert.offer}
                  </div>

                  <div>
                    <Link
                      href={`/chat?mascot=${expert.id}`}
                      className="text-sm font-semibold text-hot-pink hover:text-pink-500"
                    >
                      Ask {expert.name.replace("™", "")}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>

        <DashboardNav />
      </div>
    </Providers>
  );
}
