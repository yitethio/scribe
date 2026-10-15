import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import { useScribe } from "../store/scribeContext";
import { AppLayout, pageClass } from "../components/layout/AppLayout";

const vocabularyBreakdown = [
  { value: 147, label: "Words learned", note: "12 more this week", tone: "text-ink", noteTone: "text-good" },
  { value: 83, label: "Used well", note: "In natural phrases", tone: "text-ink", noteTone: "text-ink-3" },
  { value: 21, label: "Need another look", note: "Booked for spaced practice", tone: "text-warn", noteTone: "text-ink-3" },
  { value: 11, label: "Often misused", note: "Usually the wrong partner word", tone: "text-pen", noteTone: "text-ink-3" }
];

const heatShades = ["bg-tint", "bg-tint-2", "bg-[#9a9da3]", "bg-ink"];
const heatLevel = (i) => (i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : i % 2 === 0 ? 1 : 0);

export default function Progress() {
  const { state } = useScribe();
  const { skills } = state;

  return (
    <AppLayout
      title="Progress"
      subtitle="How your writing has changed over the weeks, which words have stuck, and the habit behind it."
    >
      <div className={`${pageClass} space-y-6 lg:space-y-8`}>
        {/* The headline trend */}
        <section className="sheet p-6 sm:p-10 rise">
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <h2 className="font-serif text-[30px] sm:text-[36px] leading-[1.08] tracking-[-0.02em] font-medium">
                Cohesion is up 14 points in six weeks
              </h2>
              <p className="mt-3 text-[16px] text-ink-2 max-w-[52ch]">
                Practice in the revision lab and your book rewrites has cleared out most of the weak links between
                paragraphs.
              </p>
            </div>
            <div className="lg:col-span-5 flex items-end gap-6 sm:gap-10">
              <div>
                <div className="font-serif text-[48px] sm:text-[56px] leading-none tracking-[-0.03em] text-ink-3 tabular">47</div>
                <div className="mt-2 text-[13px] text-ink-3">Week 36</div>
              </div>
              <ArrowRight size={24} className="text-ink-3 mb-8" aria-hidden="true" />
              <div>
                <div className="font-serif text-[72px] sm:text-[88px] leading-none tracking-[-0.03em] text-good tabular">61</div>
                <div className="mt-2 text-[13px] text-ink-2">Now, out of 100</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <section className="sheet p-6 sm:p-8 rise" style={{ "--i": 1 }}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-[24px] font-medium">Your vocabulary</h2>
              <span className="text-[14px] text-good">71% remembered</span>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8">
              {vocabularyBreakdown.map((item) => (
                <div key={item.label}>
                  <div className={`font-serif text-[44px] leading-none tracking-[-0.02em] tabular ${item.tone}`}>{item.value}</div>
                  <div className="mt-2 text-[14px] font-medium">{item.label}</div>
                  <div className={`text-[13px] ${item.noteTone}`}>{item.note}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="sheet p-6 sm:p-8 rise" style={{ "--i": 2 }}>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-[24px] font-medium">Core skills</h2>
              <span className="tag">Level IV benchmark</span>
            </div>
            <ul className="mt-7 space-y-4">
              {skills.map((skill, idx) => (
                <li key={skill.id}>
                  <div className="flex items-baseline justify-between text-[14.5px]">
                    <span className={skill.focus ? "font-medium" : ""}>{skill.name}</span>
                    <span className="tabular font-medium">{skill.score}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-tint overflow-hidden">
                    <div
                      className={`h-full rounded-full grow-x ${skill.focus ? "bg-pen" : "bg-ink"}`}
                      style={{ width: `${skill.score}%`, "--i": idx }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Pattern the coach noticed */}
        <section className="rounded-[10px] bg-ink text-paper p-6 sm:p-10 rise" style={{ "--i": 3 }}>
          <p className="text-[14px] text-paper/60">A pattern in your prose</p>
          <blockquote className="mt-4 font-serif italic text-[22px] sm:text-[26px] leading-[1.4] max-w-[52ch]">
            &ldquo;You use advanced words correctly on their own, but sometimes reach for a harder word than the
            sentence needs, and the sentences grow dense.&rdquo;
          </blockquote>
          <div className="mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <div className="text-[15px] font-medium">Focus next on precision and simplicity</div>
              <p className="mt-1 text-[14px] text-paper/70 max-w-[56ch]">
                Swap long Latin-rooted words for short, direct verbs.
              </p>
            </div>
            <Link to="/revision-mode" className="btn btn-pen h-11 px-5 shrink-0">
              <span>Start the exercises</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </section>

        {/* Habit */}
        <section className="sheet p-6 sm:p-8 rise" style={{ "--i": 4 }}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-serif text-[24px] font-medium">The last 30 days</h2>
              <p className="mt-1 text-[14px] text-ink-3">One square per day, darker for more writing</p>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-ink-3" aria-hidden="true">
              <span>Less</span>
              {heatShades.map((shade) => (
                <span key={shade} className={`w-3.5 h-3.5 rounded-[3px] ${shade}`} />
              ))}
              <span>More</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-10 sm:grid-cols-15 gap-1.5 sm:gap-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-[4px] ${heatShades[heatLevel(i)]} transition-transform hover:scale-110`}
                title={`Day ${i + 1}: ${i % 2 === 0 ? "wrote" : "rest day"}`}
              />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
