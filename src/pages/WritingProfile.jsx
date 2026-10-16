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
      eyebrow="About your writing"
      title="Writing profile"
      subtitle="What Scribe has learned about how you write, and what to practice next."
    >
      <div className={`${pageClass} flex flex-col gap-6`}>
        <section className="card p-6 sm:p-9 rise">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            <img
              src={user.avatar || "/avatar.jpg"}
              alt={user.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl border border-edge object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag tag-dot tag-pen">{user.role.split(" • ")[0]}</span>
                <span className="tag">{user.role.split(" • ")[1] || "Learner"}</span>
              </div>
              <h2 className="mt-3 font-serif text-[34px] sm:text-[42px] leading-[1.05] tracking-[-0.025em]">
                {user.name}
              </h2>
              <p className="mt-1.5 text-[15px] text-ink-2">Writing as an analytical realist</p>
              <p className="mt-4 text-[15.5px] text-ink leading-relaxed max-w-[62ch]">
                Working towards better prose through daily rewriting, careful vocabulary and steady self-revision. The
                coach says less as you need it less.
              </p>
              <div className="mt-6 fact-strip max-w-[560px]">
                {[
                  { value: user.streakDays, label: "day streak" },
                  { value: vocabulary.length, label: "words saved" },
                  { value: user.wordsWrittenThisMonth.toLocaleString(), label: "words this month" }
                ].map((f) => (
                  <div key={f.label}>
                    <div className="font-serif text-[28px] leading-none tabular">{f.value}</div>
                    <div className="mt-1 text-[12.5px] text-ink-3">{f.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rise" style={{ "--i": 1 }} aria-labelledby="learned-title">
          <span className="eyebrow">From 15 sessions, book rewrites and challenge entries</span>
          <h2 id="learned-title" className="mt-1 font-serif text-[30px] leading-tight tracking-[-0.015em]">
            What I have learned about your writing
          </h2>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card px-3 sm:px-5 pt-6 pb-2">
              <div className="px-3 pb-4 flex items-center justify-between gap-3">
                <h3 className="font-serif text-[24px] leading-tight">What you do well</h3>
                <span className="tag tag-dot tag-good">{strengths.length} strengths</span>
              </div>
              <ul className="rows border-t border-rule">
                {strengths.map((item) => (
                  <li key={item.title} className="flex items-start gap-4 px-3 py-4">
                    <span className="icon-tile bg-good-soft text-good">
                      <CheckCircle size={18} weight="fill" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-serif text-[19px] leading-snug">{item.title}</div>
                      <p className="mt-1 text-[14px] text-ink-2 leading-relaxed">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card px-3 sm:px-5 pt-6 pb-2">
              <div className="px-3 pb-4 flex items-center justify-between gap-3">
                <h3 className="font-serif text-[24px] leading-tight">What to work on</h3>
                <span className="tag tag-dot tag-pen">{weaknesses.length} to practise</span>
              </div>
              <ul className="rows border-t border-rule">
                {weaknesses.map((item) => (
                  <li key={item.title} className="flex items-start gap-4 px-3 py-4">
                    <span className="icon-tile bg-pen-soft text-pen">
                      <Warning size={18} weight="fill" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-serif text-[19px] leading-snug">
                        <span className="pen-mark">{item.title}</span>
                      </div>
                      <p className="mt-1 text-[14px] text-ink-2 leading-relaxed">{item.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="panel-dark p-6 sm:p-10 flex flex-wrap items-center gap-8 rise" style={{ "--i": 2 }}>
          <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-4">
            <p className="eyebrow text-night-mute flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-pen" aria-hidden="true" />
              Your focus right now
            </p>
            <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.08] tracking-[-0.02em] max-w-[18ch]">
              {user.currentFocus.title.charAt(0).toUpperCase() + user.currentFocus.title.slice(1)}
            </h2>
            <p className="font-serif italic text-[19px] leading-[1.45] text-night-soft max-w-[50ch]">
              &ldquo;{user.currentFocus.description}&rdquo;
            </p>
          </div>
          <div className="panel-dark-inner flex-[1_1_300px] max-w-full lg:max-w-[358px] p-6 flex flex-col gap-4">
            <span className="eyebrow text-night-mute">Recommended drill</span>
            <p className="font-serif text-[20px] leading-[1.35]">{user.currentFocus.recommendation}</p>
            <div className="flex flex-wrap gap-2">
              <span className="chip chip-dark">150 words</span>
              <span className="chip chip-dark">No passive voice</span>
            </div>
            <Link to="/write" className="btn btn-pen w-full">
              Do this drill now
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
