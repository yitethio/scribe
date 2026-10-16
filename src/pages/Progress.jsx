import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendUp } from "@phosphor-icons/react";
import { useScribe } from "../store/scribeContext";
import { AppLayout, pageClass } from "../components/layout/AppLayout";
import { SkillBars, SkillLegend, priorScore } from "../components/ui/SkillBars";

const vocabularyBreakdown = [
  { value: 147, label: "Words learned", note: "12 more this week", bar: "", noteTone: "text-good" },
  { value: 83, label: "Used well", note: "In natural phrases", bar: "bg-good" },
  { value: 21, label: "Need another look", note: "Booked for spaced practice", bar: "bg-[#c99a3e]" },
  { value: 11, label: "Often misused", note: "Usually the wrong partner word", bar: "bg-pen" }
];

const heatShades = ["bg-tint-2", "bg-[#ecc3b2]", "bg-[#d77d5d]", "bg-pen"];
const heatLevel = (i) => (i % 4 === 0 ? 3 : i % 3 === 0 ? 2 : i % 2 === 0 ? 1 : 0);

export default function Progress() {
  const { state } = useScribe();
  const { skills, user } = state;
  const pct = (skill) => parseInt(skill.change, 10) || 0;
  const biggest = [...skills].sort((a, b) => pct(b) - pct(a))[0];
  const strongest = [...skills].sort((a, b) => b.score - a.score)[0];
  const average = Math.round(skills.reduce((sum, s) => sum + s.score, 0) / skills.length);

  return (
    <AppLayout
      eyebrow="Last six weeks"
      title="Progress"
      subtitle="How your writing has changed over the weeks, which words have stuck, and the habit behind it."
    >
      <div className={`${pageClass} flex flex-col gap-6`}>
        {/* The headline trend */}
        <section className="card p-6 sm:p-9 flex flex-col gap-7 rise">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="flex-[1_1_420px] min-w-0">
              <span className="tag tag-good">
                <TrendUp size={13} weight="bold" />
                Biggest gain
              </span>
              <h2 className="mt-4 font-serif text-[32px] sm:text-[40px] leading-[1.08] tracking-[-0.02em]">
                {biggest.name} is up {biggest.change.replace("+", "")} in six weeks
              </h2>
              <p className="mt-3 text-[16px] text-ink-2 max-w-[52ch]">
                Practice in the revision lab and your book rewrites has cleared out most of the weak links between
                paragraphs.
              </p>
            </div>
            <div className="flex items-end gap-6 sm:gap-8">
              <div>
                <div className="font-serif text-[52px] leading-none tracking-[-0.03em] text-ink-3 tabular">{priorScore(biggest)}</div>
                <div className="mt-2 text-[13px] text-ink-3">Six weeks ago</div>
              </div>
              <ArrowRight size={22} className="text-ink-3 mb-9" aria-hidden="true" />
              <div>
                <div className="font-serif text-[80px] sm:text-[92px] leading-[0.85] tracking-[-0.03em] text-good tabular">
                  {biggest.score}
                </div>
                <div className="mt-2 text-[13px] text-ink-2">Now, out of 100</div>
              </div>
            </div>
          </div>
          <div className="fact-strip">
            <div>
              <span className="text-[12.5px] text-ink-3">Average score</span>
              <span className="text-[15px] font-semibold tabular">{average} of 100</span>
            </div>
            <div>
              <span className="text-[12.5px] text-ink-3">Strongest skill</span>
              <span className="text-[15px] font-semibold">
                {strongest.name} · {strongest.score}
              </span>
            </div>
            <div>
              <span className="text-[12.5px] text-ink-3">Words this month</span>
              <span className="text-[15px] font-semibold tabular">{user.wordsWrittenThisMonth.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[12.5px] text-ink-3">Level IV benchmark</span>
              <span className="text-[15px] font-semibold text-good">{biggest.name} now meets it</span>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-6">
          <section className="card flex-[1_1_420px] min-w-0 p-6 sm:p-8 flex flex-col gap-6 rise" style={{ "--i": 1 }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="eyebrow">Vocabulary</span>
                <h2 className="mt-1 font-serif text-[28px] leading-tight tracking-[-0.015em]">Which words have stuck</h2>
              </div>
              <span className="tag tag-dot tag-good shrink-0">{user.vocabularyRetentionRate}% remembered</span>
            </div>
            <ul className="rows border-t border-rule">
              {vocabularyBreakdown.map((item) => (
                <li key={item.label} className="py-4 flex items-center gap-5">
                  <span className="font-serif text-[36px] leading-none tracking-[-0.02em] tabular w-16">{item.value}</span>
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[15px] font-medium">{item.label}</span>
                      <span className={`text-[13px] text-right ${item.noteTone || "text-ink-3"}`}>{item.note}</span>
                    </div>
                    <div className="track h-1.5">
                      <span className={`grow-x ${item.bar}`} style={{ width: `${(item.value / 147) * 100}%` }} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="card flex-[1_1_420px] min-w-0 p-6 sm:p-8 flex flex-col gap-6 rise" style={{ "--i": 2 }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="eyebrow">Core skills</span>
                <h2 className="mt-1 font-serif text-[28px] leading-tight tracking-[-0.015em]">Where each skill stands</h2>
              </div>
              <span className="tag tag-dot tag-info shrink-0">Level IV</span>
            </div>
            <SkillLegend />
            <SkillBars skills={skills} />
          </section>
        </div>

        {/* Pattern the coach noticed */}
        <section className="panel-dark p-6 sm:p-10 flex flex-wrap items-center gap-8 rise" style={{ "--i": 3 }}>
          <div className="flex-[1_1_420px] min-w-0">
            <p className="eyebrow text-night-mute flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-pen" aria-hidden="true" />A pattern in your prose
            </p>
            <blockquote className="mt-4 font-serif italic text-[22px] sm:text-[26px] leading-[1.4] max-w-[48ch]">
              &ldquo;You use advanced words correctly on their own, but sometimes reach for a harder word than the
              sentence needs, and the sentences grow dense.&rdquo;
            </blockquote>
          </div>
          <div className="panel-dark-inner flex-[1_1_300px] max-w-full lg:max-w-[358px] p-6 flex flex-col gap-4">
            <span className="eyebrow text-night-mute">Focus next</span>
            <p className="font-serif text-[22px] leading-[1.3]">Precision and simplicity</p>
            <p className="text-[14px] text-night-soft">Swap long Latin-rooted words for short, direct verbs.</p>
            <Link to="/revision-mode" className="btn btn-pen w-full">
              Start the exercises
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </section>

        {/* Habit */}
        <section className="card p-6 sm:p-8 rise" style={{ "--i": 4 }}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Habit</span>
              <h2 className="mt-1 font-serif text-[28px] leading-tight tracking-[-0.015em]">The last 30 days</h2>
              <p className="mt-1 text-[14px] text-ink-3">One square per day, deeper for more writing</p>
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
                className={`aspect-square rounded-[5px] ${heatShades[heatLevel(i)]} transition-transform hover:scale-110`}
                title={`Day ${i + 1}: ${i % 2 === 0 ? "wrote" : "rest day"}`}
              />
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
