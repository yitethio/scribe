import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Trophy,
  PencilSimpleLine,
  ArrowsClockwise,
  Clock,
  Check,
  CaretRight,
  CaretDown,
  TrendUp
} from "@phosphor-icons/react";
import { useScribe } from "../store/scribeContext";
import { AppLayout, pageClass } from "../components/layout/AppLayout";
import { BookCover } from "../components/ui/BookCover";
import { StatusTag } from "../components/ui/StatusTag";
import { SkillBars, SkillLegend } from "../components/ui/SkillBars";

const MONTHLY_GOAL = 5000;

const activityMeta = {
  "Book Session": { icon: BookOpen, route: "/book-session", kind: "Book session" },
  "Weekly Challenge": { icon: Trophy, route: "/challenges", kind: "Weekly challenge" },
  "Revision Lab": { icon: ArrowsClockwise, route: "/revision-mode", kind: "Revision lab" }
};

const greeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

// "Oct 9, 2026" reads as "Oct 9" in a list where every date is this year.
const shortWhen = (stamp) => stamp.replace(/, \d{4}$/, "");

function StatCard({ label, value, unit, children, i }) {
  return (
    <section className="card p-5 sm:p-[22px] flex flex-col gap-3.5 rise" style={{ "--i": i }}>
      <h2 className="text-[14px] font-medium text-ink-soft">{label}</h2>
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-[48px] leading-[0.95] tracking-[-0.03em] tabular">{value}</span>
        {unit && <span className="text-[15px] text-ink-3">{unit}</span>}
      </div>
      <div className="mt-auto flex flex-col gap-3">{children}</div>
    </section>
  );
}

export default function Dashboard() {
  const { state } = useScribe();
  const { user, skills, vocabulary, bookSession, challenges, recentActivity } = state;
  const firstName = user.name.split(" ")[0];
  const goalPercent = Math.round((user.wordsWrittenThisMonth / MONTHLY_GOAL) * 100);
  const toGo = Math.max(0, MONTHLY_GOAL - user.wordsWrittenThisMonth);
  const focusSkill = skills.find((s) => s.focus);
  const pct = (skill) => parseInt(skill.change, 10) || 0;
  const biggest = [...skills].sort((a, b) => pct(b) - pct(a))[0];
  const strongest = [...skills].sort((a, b) => b.score - a.score)[0];
  const bookPercent = Math.round((bookSession.currentPage / bookSession.totalPages) * 100);
  const wordsReady = challenges.rubric.filter((r) => r.used).length;
  const ready = wordsReady >= challenges.targetCount;
  // Stored newest first; drawn oldest to newest so today sits at the end.
  const streakDays = [...user.streakHistory].reverse();

  return (
    <AppLayout
      title={`${greeting()}, ${firstName}.`}
      subtitle="The aim is not better essays written by AI. It is better essays written by you, because your instincts and vocabulary have grown."
    >
      <div className={`${pageClass} flex flex-col gap-6`}>
        {/* Teacher's note and today's drill */}
        <section className="panel-dark p-6 sm:p-10 flex flex-wrap items-center gap-8 lg:gap-10 rise">
          <div className="flex-[1_1_380px] min-w-0 flex flex-col gap-4">
            <p className="eyebrow text-night-mute flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-pen" aria-hidden="true" />
              Teacher's note · this week
            </p>
            <h2 className="font-serif text-[32px] sm:text-[42px] leading-[1.08] tracking-[-0.02em] max-w-[16ch]">
              {user.currentFocus.title.charAt(0).toUpperCase() + user.currentFocus.title.slice(1)}
            </h2>
            <blockquote className="font-serif italic text-[19px] sm:text-[21px] leading-[1.45] text-night-soft max-w-[48ch]">
              &ldquo;{user.currentFocus.description}&rdquo;
            </blockquote>
          </div>

          <div className="panel-dark-inner flex-[1_1_300px] max-w-full lg:max-w-[358px] p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow text-night-mute">Today's drill</span>
              <span className="flex items-center gap-1.5 text-[13px] text-night-mute">
                <Clock size={14} />
                Not started
              </span>
            </div>
            <p className="font-serif text-[22px] leading-[1.3]">Explain one idea in 150 words without a single passive verb.</p>
            <div className="flex flex-wrap gap-2">
              <span className="chip chip-dark">150 words</span>
              <span className="chip chip-dark">No passive voice</span>
              {focusSkill && <span className="chip chip-dark">Trains {focusSkill.name}</span>}
            </div>
            <Link to="/revision-mode" className="btn btn-pen w-full mt-1">
              Start the precision drill
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </section>

        {/* The month in four numbers */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(230px,100%),1fr))] gap-4 sm:gap-5">
          <StatCard label="Writing streak" value={user.streakDays} unit="days" i={1}>
            <div className="flex gap-[5px]" role="img" aria-label={`${user.streakDays} of the last 14 days written`}>
              {streakDays.map((on, idx) => (
                <span
                  key={idx}
                  className={`w-[11px] h-[11px] rounded-[3px] ${on ? "bg-pen" : "bg-tint-2"}`}
                  style={idx === streakDays.length - 1 ? { boxShadow: "0 0 0 2px var(--color-sheet), 0 0 0 3.5px var(--color-ink)" } : undefined}
                />
              ))}
            </div>
            <p className="flex items-center gap-1.5 text-[13px] font-medium text-good">
              <TrendUp size={14} weight="bold" />4 days past your record
            </p>
          </StatCard>

          <StatCard label="Words this month" value={user.wordsWrittenThisMonth.toLocaleString()} unit={`/ ${MONTHLY_GOAL.toLocaleString()}`} i={2}>
            <div className="track">
              <span className="grow-x" style={{ width: `${Math.min(goalPercent, 100)}%` }} />
            </div>
            <p className="text-[13px] text-ink-3 tabular">
              {goalPercent}% of goal · {toGo.toLocaleString()} to go
            </p>
          </StatCard>

          <StatCard label="Vocabulary saved" value={vocabulary.length} unit="words" i={3}>
            <div className="track">
              <span className="grow-x bg-good" style={{ width: `${user.vocabularyRetentionRate}%` }} />
            </div>
            <p className="flex items-center justify-between gap-3 text-[13px] text-ink-3">
              {user.vocabularyRetentionRate}% still remembered
              <Link to="/vocabulary" className="link-underline text-ink">
                Review
              </Link>
            </p>
          </StatCard>

          <StatCard label="Guided sessions" value={user.sessionsCompletedCount} unit="completed" i={4}>
            <p className="text-[13px] text-ink-3">Books, challenges and drills</p>
          </StatCard>
        </div>

        <div className="flex flex-wrap gap-6">
          {/* Skill scores, split into what was there and what was gained */}
          <section className="card flex-[7_1_460px] min-w-0 p-6 sm:p-8 flex flex-col gap-6 rise" style={{ "--i": 5 }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-[28px] leading-tight tracking-[-0.015em]">How your writing scores</h2>
                <p className="mt-1 text-[14px] text-ink-3">Out of 100, with the change over six weeks</p>
              </div>
              <Link to="/progress" className="link text-[14px] shrink-0 -mt-2">
                Full progress
                <ArrowRight size={14} weight="bold" />
              </Link>
            </div>

            <SkillLegend />

            <SkillBars skills={skills} />

            <div className="fact-strip mt-auto">
              <div>
                <span className="text-[12.5px] text-ink-3">Biggest gain</span>
                <span className="text-[15px] font-semibold">
                  {biggest.name} {biggest.change}
                </span>
              </div>
              <div>
                <span className="text-[12.5px] text-ink-3">Strongest skill</span>
                <span className="text-[15px] font-semibold">
                  {strongest.name} · {strongest.score}
                </span>
              </div>
              <div>
                <span className="text-[12.5px] text-ink-3">Level IV benchmark</span>
                <span className="text-[15px] font-semibold text-good">{biggest.name} now meets it</span>
              </div>
            </div>
          </section>

          <div className="flex-[5_1_340px] min-w-0 flex flex-col gap-6">
            {/* Book session */}
            <section className="card p-6 flex flex-col gap-5 rise" style={{ "--i": 6 }}>
              <div className="flex gap-5">
                <BookCover title={bookSession.bookTitle} />
                <div className="min-w-0 flex flex-col gap-1.5">
                  <span className="eyebrow">Book session</span>
                  <h3 className="font-serif text-[22px] leading-[1.2]">{bookSession.bookTitle}</h3>
                  <p className="text-[14px] text-ink-3">{bookSession.author}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[13px] text-ink-3 tabular">
                  <span>
                    <span className="font-semibold text-ink">Page {bookSession.currentPage}</span> of {bookSession.totalPages}
                  </span>
                  <span>{bookPercent}%</span>
                </div>
                <div className="track h-1.5">
                  <span className="grow-x" style={{ width: `${bookPercent}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-serif text-[26px] leading-none tabular">{bookSession.wordsRewritten.toLocaleString()}</div>
                  <div className="mt-1.5 text-[13px] text-ink-3">words rewritten</div>
                </div>
                <div>
                  <div className="font-serif text-[26px] leading-none tabular">{bookSession.sessionVocabulary.length}</div>
                  <div className="mt-1.5 text-[13px] text-ink-3">new words found</div>
                </div>
              </div>
              <Link to="/book-session" className="btn btn-outline w-full">
                Continue rewriting
                <ArrowRight size={16} weight="bold" />
              </Link>
            </section>

            {/* Weekly challenge */}
            <section className="card p-6 flex flex-col gap-4 flex-1 rise" style={{ "--i": 7 }}>
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow">Weekly challenge</span>
                <span className="tag tag-warn">
                  <Clock size={13} weight="bold" />
                  Due Sunday · 2 days
                </span>
              </div>
              <h3 className="font-serif text-[22px] leading-[1.25]">&ldquo;{challenges.theme}&rdquo;</h3>
              <ul className="flex flex-col gap-3 text-[14.5px]">
                <li className="flex items-center gap-3">
                  <span className="w-[20px] h-[20px] rounded-full border-[1.5px] border-line shrink-0" aria-hidden="true" />
                  Write 300 to 500 words
                </li>
                <li className="flex items-start gap-3">
                  <span
                    className={`w-[20px] h-[20px] rounded-full shrink-0 flex items-center justify-center ${
                      ready ? "bg-good text-white" : "border-[1.5px] border-line"
                    }`}
                    aria-hidden="true"
                  >
                    {ready && <Check size={12} weight="bold" />}
                  </span>
                  <div className="flex-1 flex flex-col gap-2">
                    <span>
                      Use at least {challenges.targetCount} of your {challenges.words.length} words
                    </span>
                    <div className="flex gap-1" aria-hidden="true">
                      {challenges.words.map((w, idx) => (
                        <span key={w} className={`h-[5px] flex-1 rounded-full ${idx < wordsReady ? "bg-good" : "bg-tint-2"}`} />
                      ))}
                    </div>
                    <span className="text-[13px] text-ink-3 tabular">
                      <span className="font-semibold text-ink">
                        {wordsReady} of {challenges.words.length}
                      </span>{" "}
                      ready · {challenges.targetCount} needed
                    </span>
                  </div>
                </li>
              </ul>
              <Link to="/challenges" className="btn btn-primary w-full mt-auto">
                Open challenge
                <ArrowRight size={16} weight="bold" />
              </Link>
            </section>
          </div>
        </div>

        {/* Recent writing */}
        <section className="card px-3 sm:px-5 pt-6 pb-3 rise" style={{ "--i": 8 }}>
          <div className="flex items-center justify-between gap-4 px-3 pb-4">
            <h2 className="font-serif text-[28px] leading-tight tracking-[-0.015em]">Recent writing</h2>
            <button type="button" className="btn btn-quiet btn-sm">
              Last 7 days
              <CaretDown size={13} weight="bold" />
            </button>
          </div>

          <ul className="rows border-t border-rule">
            {recentActivity.map((activity) => {
              const meta = activityMeta[activity.type] || { icon: PencilSimpleLine, route: "/write", kind: "Writing" };
              const Icon = meta.icon;
              return (
                <li key={activity.id}>
                  <Link to={meta.route} className="row-link flex items-center gap-4 px-3 py-4 group">
                    <span className="icon-tile">
                      <Icon size={18} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-[19px] leading-snug truncate">{activity.title}</div>
                      <div className="mt-0.5 text-[13px] text-ink-3">
                        {meta.kind} · {shortWhen(activity.timestamp)}
                      </div>
                    </div>
                    <span className="hidden md:block w-24 text-right text-[13.5px] text-ink-3 tabular">
                      {activity.wordCount.toLocaleString()} words
                    </span>
                    <span className="hidden md:block w-16 text-right text-[13.5px] text-ink-3 tabular">{activity.duration}</span>
                    <span className="hidden sm:flex w-28 justify-end">
                      <StatusTag status={activity.status} />
                    </span>
                    <CaretRight
                      size={16}
                      className="text-ink-3 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}
