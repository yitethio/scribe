import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Warning, ArrowRight } from "@phosphor-icons/react";
import { useScribe } from "../store/scribeContext";
import { AppLayout, pageClass } from "../components/layout/AppLayout";

export default function WritingProfile() {
  const { state } = useScribe();
  const { user, vocabulary } = state;

  const strengths = [
    {
      title: "Good vocabulary growth",
      detail: "You consistently acquire and deploy nuanced adjectives and evocative verbs in original writing."
    },
    {
      title: "Strong descriptive language",
      detail: "Your setting details paint sensory images with high specificity rather than generic adjectives."
    },
    {
      title: "Good topic development",
      detail: "Paragraphs sustain a central idea without digressing prematurely into unrelated claims."
    }
  ];

  const weaknesses = [
    {
      title: "Prepositions after verbs and nouns",
      detail: "Tendency to pair verbs and nouns with non-standard prepositions (e.g. 'influence to' instead of 'influence on')."
    },
    {
      title: "Articles: a, an and the",
      detail: "Occasional omission of definite articles when introducing specific abstract concepts."
    },
    {
      title: "Sentences that run long",
      detail: "Sentences occasionally exceed 35 words by compounding multiple dependent clauses."
    },
    {
      title: "Weak links between paragraphs",
      detail: "Shifting to new arguments without clear transitional markers or contrastive bridges."
    }
  ];

  return (
    <AppLayout
      title="Writing profile"
      subtitle="What Scribe has learned about how you write, and what to practice next."
    >
      <div className={`${pageClass} space-y-6 lg:space-y-8`}>
        <section className="sheet p-6 sm:p-10 rise">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <img
              src={user.avatar || "/avatar.jpg"}
              alt={user.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-[8px] object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h2 className="font-serif text-[32px] sm:text-[38px] leading-[1.05] tracking-[-0.02em] font-medium">
                {user.name}
              </h2>
              <p className="mt-1.5 text-[15px] text-ink-2">
                {user.role.split(" • ")[0]}, writing as an analytical realist
              </p>
              <p className="mt-4 text-[15.5px] text-ink leading-relaxed max-w-[62ch]">
                Working towards better prose through daily rewriting, careful vocabulary and steady self-revision. The
                coach says less as you need it less.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
                {[
                  { value: user.streakDays, label: "day streak" },
                  { value: vocabulary.length, label: "words saved" },
                  { value: user.wordsWrittenThisMonth.toLocaleString(), label: "words this month" }
                ].map((f) => (
                  <div key={f.label}>
                    <div className="font-serif text-[32px] leading-none tabular">{f.value}</div>
                    <div className="mt-1.5 text-[13px] text-ink-3">{f.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rise" style={{ "--i": 1 }} aria-labelledby="learned-title">
          <h2 id="learned-title" className="font-serif text-[28px] font-medium tracking-[-0.015em]">
            What I have learned about your writing
          </h2>
          <p className="mt-1 text-[14px] text-ink-3">From 15 sessions, book rewrites and challenge entries</p>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="sheet p-6 sm:p-8">
              <h3 className="flex items-center gap-2 text-[15px] font-medium text-good">
                <CheckCircle size={18} weight="fill" />
                What you do well
              </h3>
              <ul className="mt-5 space-y-5">
                {strengths.map((item) => (
                  <li key={item.title}>
                    <div className="font-serif text-[19px] leading-snug">{item.title}</div>
                    <p className="mt-1 text-[14.5px] text-ink-2 leading-relaxed">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sheet p-6 sm:p-8">
              <h3 className="flex items-center gap-2 text-[15px] font-medium text-pen">
                <Warning size={18} weight="fill" />
                What to work on
              </h3>
              <ul className="mt-5 space-y-5">
                {weaknesses.map((item) => (
                  <li key={item.title}>
                    <div className="font-serif text-[19px] leading-snug">
                      <span className="pen-mark">{item.title}</span>
                    </div>
                    <p className="mt-1 text-[14.5px] text-ink-2 leading-relaxed">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-[10px] bg-pen-soft p-6 sm:p-10 rise" style={{ "--i": 2 }}>
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <p className="text-[14px] text-pen-deep">Your focus right now</p>
              <h2 className="mt-2 font-serif text-[30px] sm:text-[36px] leading-[1.08] tracking-[-0.02em] font-medium">
                {user.currentFocus.title.charAt(0).toUpperCase() + user.currentFocus.title.slice(1)}
              </h2>
              <p className="mt-4 font-serif text-[19px] leading-[1.45] text-ink-2 max-w-[52ch]">
                {user.currentFocus.description}
              </p>
            </div>
            <div className="lg:col-span-4 space-y-5">
              <p className="font-serif italic text-[17px] leading-[1.5]">&ldquo;{user.currentFocus.recommendation}&rdquo;</p>
              <Link to="/write" className="btn btn-primary h-11 px-5">
                <span>Do this drill now</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
