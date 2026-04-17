import Link from "next/link";
import { anatomyCourse } from "@/lib/study/anatomy-data";

const nLectures = anatomyCourse.lectures.length;
const nQuestions = anatomyCourse.lectures.reduce((s, l) => s + l.quiz.length, 0);

export default function AnatomyLanding() {
  return (
    <div className="min-h-screen bg-black text-gray-100">
      <header className="border-b border-gray-800 bg-gradient-to-b from-gray-950 to-black px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FF69B4]">
            No Prior Authorization
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            Anatomy &amp; Physiology{" "}
            <span className="text-[#FF69B4]">Study Hub</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-400 md:text-lg">
            Built for nursing students: structured lectures, printable-style cheat
            sheets, instant-feedback quizzes, and flip flashcards — in one place.
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/nursing-study/anatomy/hub"
              className="inline-flex items-center justify-center rounded-lg bg-[#FF69B4] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#FF1493]"
            >
              Open study hub →
            </Link>
            <Link
              href="/login?callbackUrl=/nursing-study/anatomy/hub"
              className="inline-flex items-center justify-center rounded-lg border border-gray-600 px-6 py-3 text-base font-medium text-gray-200 transition-colors hover:border-[#FF69B4]/50 hover:text-[#FF69B4]"
            >
              Log in to save progress
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            You can browse the hub without an account. Sign in to sync quiz and
            flashcard progress across devices.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 text-center">
            <p className="text-3xl font-bold text-[#FF69B4]">{nLectures}</p>
            <p className="mt-1 text-sm text-gray-400">lecture modules</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 text-center">
            <p className="text-3xl font-bold text-[#FF69B4]">{nQuestions}</p>
            <p className="mt-1 text-sm text-gray-400">quiz questions</p>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 text-center">
            <p className="text-3xl font-bold text-[#FF69B4]">3</p>
            <p className="mt-1 text-sm text-gray-400">modes per lecture</p>
          </div>
        </div>

        <h2 className="mt-14 text-center text-xl font-bold text-white md:text-2xl">
          What you get
        </h2>
        <ul className="mx-auto mt-8 grid max-w-4xl gap-6 md:grid-cols-3">
          <li className="rounded-xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-lg font-semibold text-[#FF69B4]">Cheat sheets</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              Color-coded sections per topic — scrollable reference you can work
              through before class or clinical.
            </p>
          </li>
          <li className="rounded-xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-lg font-semibold text-[#FF69B4]">Quizzes</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              Multiple choice with immediate feedback, explanations, and a running
              score per lecture.
            </p>
          </li>
          <li className="rounded-xl border border-gray-800 bg-gray-950 p-6">
            <p className="text-lg font-semibold text-[#FF69B4]">Flashcards</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">
              Flip cards, shuffle, and move through terms — built for quick recall
              drills.
            </p>
          </li>
        </ul>

        <div className="mt-14 rounded-xl border border-[#FF69B4]/30 bg-[#FF69B4]/5 p-6 text-center md:p-8">
          <p className="text-sm font-medium text-gray-300">
            Covers intro A&amp;P through tissues, skin, bone, joints, muscle, and
            intro nervous system — aligned with how we structured the course in-app.
          </p>
          <Link
            href="/nursing-study/anatomy/hub"
            className="mt-5 inline-flex rounded-lg bg-[#FF69B4] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#FF1493]"
          >
            Start studying
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-800 px-4 py-8 text-center text-xs text-gray-600">
        <Link href="/" className="text-gray-500 hover:text-[#FF69B4]">
          ← Back to No Prior Authorization
        </Link>
      </footer>
    </div>
  );
}
