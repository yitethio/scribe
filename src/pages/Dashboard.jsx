import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpenText, Trophy, PenNib } from "@phosphor-icons/react";
import { useScribe } from "../store/scribeContext";
import { AppLayout, pageClass } from "../components/layout/AppLayout";

const MONTHLY_GOAL = 5000;

const activityIcon = {
  "Book Session": BookOpenText,
  "Weekly Challenge": Trophy
};

const activityRoute = {
  "Book Session": "/book-session",
  "Weekly Challenge": "/challenges"
};

function Figure({ value, unit, label, note, noteTone = "text-ink-3", children, i }) {
  return (
    <div className="rise min-w-0" style={{ "--i": i }}>
      <div className="flex items-baseline gap-1.5">
        <span className="font-serif text-[48px] sm:text-[56px] leading-none tracking-[-0.03em] tabular">
          {value}
        </span>
        {unit && <span className="text-[15px] text-ink-2">{unit}</span>}
      </div>
      <div className="mt-3 text-[14px] font-medium text-ink">{label}</div>
      {children}
      {note && <div className={`mt-1 text-[13px] ${noteTone}`}>{note}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { state } = useScribe();
  const { user, skills, vocabulary, bookSession, challenges, recentActivity } = state;
  const navigate = useNavigate();
  const firstName = user.name.split(" ")[0];
  const goalPercent = Math.round((user.wordsWrittenThisMonth / MONTHLY_GOAL) * 100);
  const focusSkill = skills.find((s) => s.focus);

  return (
    <AppLayout
      title={`Welcome back, ${firstName}.`}
      subtitle="The aim is not better essays written by AI. It is better essays written by you, because your instincts and vocabulary have grown."
    >
      <div className={`${pageClass} space-y-6 lg:space-y-8`}>
        {/* The month in four numbers */}
        <section aria-label="This month" className="sheet px-6 py-8 sm:px-10 sm:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            <Figure value={user.streakDays} unit="days" label="Writing streak" i={0}>
              <div className="flex gap-1 mt-2.5 max-w-[140px]" aria-hidden="true">
                {user.streakHistory.slice(0, 7).map((on, idx) => (
                  <span key={idx} className={`h-1 flex-1 rounded-full ${on ? "bg-pen" : "bg-tint-2"}`} />
                ))}
              </div>
              <div className="mt-2 text-[13px] text-good">4 days past your record</div>
            </Figure>
            <Figure
              value={user.wordsWrittenThisMonth.toLocaleString()}
              label="Words this month"
              note={`${goalPercent}% of the ${MONTHLY_GOAL.toLocaleString()} word goal`}
              i={1}
            />
            <Figure
              value={vocabulary.length}
              unit="words"
              label="Vocabulary saved"
              note={`${user.vocabularyRetentionRate}% still remembered`}
              noteTone="text-good"
              i={2}
            />
            <Figure
              value={user.sessionsCompletedCount}
              label="Guided sessions"
              note="Books, challenges and drills"
              i={3}
            />
          </div>
        </section>

        {/* The teacher's note, written in the margin */}
        <section
          className="rise rounded-[10px] bg-ink text-paper px-6 py-9 sm:px-10 sm:py-12"
          style={{ "--i": 2 }}
        >
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <p className="text-[14px] text-paper/60">Your teacher's note for this week</p>
              <h2 className="mt-3 font-serif text-[30px] sm:text-[38px] leading-[1.05] tracking-[-0.02em] font-medium">
                {user.currentFocus.title.charAt(0).toUpperCase() + user.currentFocus.title.slice(1)}
              </h2>
              <blockquote className="mt-5 font-serif italic text-[20px] sm:text-[22px] leading-[1.4] text-paper/85 max-w-[34ch] sm:max-w-[46ch]">
                &ldquo;{user.currentFocus.description}&rdquo;
              </blockquote>
            </div>
            <div className="lg:col-span-4 lg:pl-6 space-y-5">
              <p className="text-[15px] text-paper/75">
                <span className="text-paper">Today's drill:</span> a 150-word explanation with no passive voice.
              </p>
              <Link to="/revision-mode" className="btn btn-pen h-11 px-5 w-full sm:w-auto">
                <span>Start the precision drill</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Skill profile */}
          <section className="lg:col-span-7 sheet p-6 sm:p-8 rise" style={{ "--i": 3 }}>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-[26px] leading-tight tracking-[-0.015em] font-medium">
                  How your writing scores
                </h2>
                <p className="mt-1 text-[14px] text-ink-3">Out of 100, with the change over six weeks</p>
              </div>
              <Link to="/progress" className="link text-[14px] shrink-0">
                Full progress
              </Link>
            </div>

            <ul className="mt-8 space-y-5">
              {skills.map((skill, idx) => (
                <li key={skill.id}>
                  <div className="flex items-baseline justify-between gap-3 text-[14.5px]">
                    <span className={skill.focus ? "font-medium text-ink" : "text-ink"}>
                      {skill.name}
                      {skill.focus && <span className="ml-2 text-[13px] text-pen">This week's focus</span>}
                    </span>
                    <span className="tabular flex items-baseline gap-3">
                      <span className="text-[13px] text-good">{skill.change}</span>
                      <span className="font-medium w-7 text-right">{skill.score}</span>
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-tint overflow-hidden">
                    <div
                      className={`h-full rounded-full grow-x ${skill.focus ? "bg-pen" : "bg-ink"}`}
                      style={{ width: `${skill.score}%`, "--i": idx }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            {focusSkill && (
              <p className="mt-8 text-[14px] text-ink-2">
                {focusSkill.name} rose {focusSkill.change.replace("+", "")} in six weeks, enough to meet the Level IV
                benchmark.
              </p>
            )}
          </section>

          {/* What is on the desk */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            <section className="sheet p-6 sm:p-7 rise" style={{ "--i": 4 }}>
              <div className="flex gap-5">
                <img
                  src={bookSession.coverUrl || "/book-cover.jpg"}
                  alt={`Cover of ${bookSession.bookTitle}`}
                  className="w-24 h-36 object-cover rounded-[4px] shrink-0"
                />
                <div className="min-w-0 flex flex-col">
                  <p className="text-[13px] text-ink-3 tabular">
                    Page {bookSession.currentPage} of {bookSession.totalPages}
                  </p>
                  <h3 className="mt-1 font-serif text-[21px] leading-[1.15] font-medium">{bookSession.bookTitle}</h3>
                  <p className="mt-1 text-[14px] text-ink-2">by {bookSession.author}</p>
                  <p className="mt-auto pt-3 text-[13.5px] text-ink-2 tabular">
                    {bookSession.wordsRewritten.toLocaleString()} words rewritten, {bookSession.sessionVocabulary.length} new
                    words
                  </p>
                </div>
              </div>
              <div className="mt-5 h-1 rounded-full bg-tint overflow-hidden">
                <div
                  className="h-full bg-ink rounded-full grow-x"
                  style={{ width: `${(bookSession.currentPage / bookSession.totalPages) * 100}%` }}
                />
              </div>
              <Link to="/book-session" className="btn btn-quiet w-full mt-5">
                <span>Continue rewriting</span>
                <ArrowRight size={16} />
              </Link>
            </section>

            <section className="sheet p-6 sm:p-7 rise flex-1" style={{ "--i": 5 }}>
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <span className="text-ink-3">Weekly challenge</span>
                <span className="text-warn font-medium">Due in 2 days</span>
              </div>
              <h3 className="mt-3 font-serif text-[22px] leading-[1.2] font-medium">&ldquo;{challenges.theme}&rdquo;</h3>
              <p className="mt-2 text-[14px] text-ink-2">
                Write 300 to 500 words using at least {challenges.targetCount} of your {challenges.words.length} words.
              </p>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <span className="font-serif text-[34px] leading-none tabular">10</span>
                  <span className="text-[14px] text-ink-2"> of {challenges.words.length} words ready</span>
                </div>
                <Link to="/challenges" className="link text-[14px]">
                  Open
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Recent writing */}
        <section className="sheet p-6 sm:p-8 rise" style={{ "--i": 6 }}>
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-[26px] leading-tight tracking-[-0.015em] font-medium">Recent writing</h2>
            <span className="text-[13px] text-ink-3">Last 7 days</span>
          </div>

          <ul className="mt-5 -mx-3">
            {recentActivity.map((activity) => {
              const Icon = activityIcon[activity.type] || PenNib;
              const route = activityRoute[activity.type] || "/write";
              return (
                <li key={activity.id}>
                  <button
                    onClick={() => navigate(route)}
                    className="w-full text-left px-3 py-4 rounded-md hover:bg-paper transition-colors flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 group"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <Icon size={20} className="text-ink-3 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-serif text-[18px] leading-snug">{activity.title}</div>
                        <div className="mt-0.5 text-[13px] text-ink-3 tabular">
                          {activity.timestamp} · {activity.wordCount.toLocaleString()} words · {activity.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pl-9 sm:pl-0 shrink-0">
                      <span className={`tag ${activity.status === "Active Session" ? "tag-pen" : ""}`}>
                        {activity.status === "Active Session" ? "In progress" : activity.status}
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                        aria-hidden="true"
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </AppLayout>
  );
}
