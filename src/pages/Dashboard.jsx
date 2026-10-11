import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Flame,
  BookOpen,
  PenTool,
  Trophy,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Clock,
  Compass,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight
} from "lucide-react";
import { useScribe } from "../store/scribeContext";
import { AppLayout } from "../components/layout/AppLayout";

export default function Dashboard() {
  const { state } = useScribe();
  const { user, skills, vocabulary, bookSession, challenges, recentActivity } = state;
  const navigate = useNavigate();

  return (
    <AppLayout
      title="Personal Writing Journey"
      subtitle="Deliberate practice, vocabulary acquisition, and revision lab"
    >
      {({ openCaptureModal }) => (
        <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150">
          {/* Personal Greeting & Philosophy Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A8D96] mb-1">
                <span>{user.role}</span>
                <span>•</span>
                <span className="text-[#059669]">Day 12 of Habit Streak</span>
              </div>
              <h2 className="font-serif font-bold text-3xl text-[#1A1A1E] tracking-tight">
                Welcome back, {user.name}
              </h2>
              <p className="text-xs text-[#5E626E] mt-1 max-w-2xl font-normal leading-relaxed">
                The objective is not better essays written by AI, but better essays written by you because your instincts and vocabulary have deepened.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/write"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1F2E3D] hover:bg-[#15202B] text-white text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Open Writing Canvas</span>
              </Link>
              <Link
                to="/book-session"
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-[#FAF8F5] text-[#1A1A1E] text-xs font-semibold rounded-xl border border-[#DDD6C9] shadow-2xs transition-all cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#B85D38]" />
                <span>Resume Book Rewrite</span>
              </Link>
            </div>
          </div>

          {/* Primary Metric Ribbon - Refined Hierarchy, Not SaaS Boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Streak */}
            <div className="p-5 bg-white rounded-2xl border border-[#E4DDD1] shadow-2xs hover:border-[#D5CDC0] transition-all">
              <div className="flex items-center justify-between text-[#8A8D96] mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Consistency Streak
                </span>
                <Flame className="w-4 h-4 text-[#EA580C] fill-[#EA580C]" />
              </div>
              <div className="font-serif font-bold text-3xl text-[#1A1A1E] tracking-tight">
                {user.streakDays} <span className="text-sm font-sans font-normal text-[#6B6F7B]">days</span>
              </div>
              <p className="text-[11px] text-[#059669] font-medium mt-1">
                +4 days beyond personal record
              </p>
            </div>

            {/* Words Written */}
            <div className="p-5 bg-white rounded-2xl border border-[#E4DDD1] shadow-2xs hover:border-[#D5CDC0] transition-all">
              <div className="flex items-center justify-between text-[#8A8D96] mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Words This Month
                </span>
                <Target className="w-4 h-4 text-[#1F2E3D]" />
              </div>
              <div className="font-serif font-bold text-3xl text-[#1A1A1E] tracking-tight">
                {user.wordsWrittenThisMonth.toLocaleString()}
              </div>
              <p className="text-[11px] text-[#555862] font-medium mt-1">
                Goal: 5,000 words (76% met)
              </p>
            </div>

            {/* Vocabulary Learned */}
            <div className="p-5 bg-white rounded-2xl border border-[#E4DDD1] shadow-2xs hover:border-[#D5CDC0] transition-all">
              <div className="flex items-center justify-between text-[#8A8D96] mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Vocabulary Learned
                </span>
                <Sparkles className="w-4 h-4 text-[#B85D38]" />
              </div>
              <div className="font-serif font-bold text-3xl text-[#1A1A1E] tracking-tight">
                {vocabulary.length} <span className="text-sm font-sans font-normal text-[#6B6F7B]">words</span>
              </div>
              <p className="text-[11px] text-[#059669] font-medium mt-1">
                {user.vocabularyRetentionRate}% retention rate
              </p>
            </div>

            {/* Guided Sessions Completed */}
            <div className="p-5 bg-white rounded-2xl border border-[#E4DDD1] shadow-2xs hover:border-[#D5CDC0] transition-all">
              <div className="flex items-center justify-between text-[#8A8D96] mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Guided Sessions
                </span>
                <Clock className="w-4 h-4 text-[#7C3AED]" />
              </div>
              <div className="font-serif font-bold text-3xl text-[#1A1A1E] tracking-tight">
                {user.sessionsCompletedCount}
              </div>
              <p className="text-[11px] text-[#555862] font-medium mt-1">
                Books, challenges & drills
              </p>
            </div>
          </div>

          {/* Current Focus & Pedagogical Recommendation */}
          <div className="p-6 bg-[#F5EFE4] border border-[#E2D8C7] rounded-2xl shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#1F2E3D] text-[#FAF8F5]">
                  Teacher's Directive
                </span>
                <span className="text-xs font-semibold text-[#B85D38]">
                  Primary Skill Focus
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[#1A1A1E]">
                {user.currentFocus.title}
              </h3>
              <p className="font-serif text-xs text-[#3E424B] leading-relaxed">
                "{user.currentFocus.description}"
              </p>
              <div className="pt-1 text-[11px] text-[#6B6F7B] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#B85D38]" />
                <span>Recommended drill: 150-word direct explanation without passive voice.</span>
              </div>
            </div>

            <Link
              to="/revision-mode"
              className="px-4 py-2.5 bg-[#B85D38] hover:bg-[#A04F2E] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Launch Precision Drill</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Two-Column Grid: Writing Skill Matrix & Active Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 6 cols: Writing Skill Mastery Visualizer */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-[#E4DDD1] shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1A1A1E]">
                    Writing Skill Matrix
                  </h3>
                  <p className="text-xs text-[#6B6F7B]">
                    Multi-dimensional longitudinal diagnostic scores
                  </p>
                </div>
                <Link
                  to="/progress"
                  className="text-xs font-semibold text-[#1F2E3D] hover:underline flex items-center gap-1"
                >
                  <span>Detailed Analytics</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#252830]">
                          {skill.name}
                        </span>
                        {skill.focus && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FAF0E6] text-[#B85D38]">
                            Focus
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-[#059669] font-medium">{skill.change}</span>
                        <span className="font-bold text-[#1A1A1E]">{skill.score}/100</span>
                      </div>
                    </div>
                    {/* Clean Progress Bar with deliberate proportion */}
                    <div className="h-2 w-full bg-[#F2EDE4] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          skill.focus ? "bg-[#B85D38]" : "bg-[#1F2E3D]"
                        }`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE7DC] flex items-center justify-between text-xs text-[#5E626E]">
                <span>Cohesion improved by <strong>14%</strong> over the last 6 weeks</span>
                <span className="font-bold text-[#1F2E3D]">Level IV Benchmark Met</span>
              </div>
            </div>

            {/* Right 6 cols: Active Writing Expeditions */}
            <div className="lg:col-span-6 space-y-4">
              {/* Active Book Rewrite Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E4DDD1] shadow-2xs hover:border-[#D5CDC0] transition-all flex items-start gap-4">
                <img
                  src={bookSession.coverUrl || "/book-cover.jpg"}
                  alt={bookSession.bookTitle}
                  className="w-20 h-28 object-cover rounded-lg border border-[#DDD6C9] shadow-xs shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF0E6] text-[#B85D38]">
                      Active Book Session
                    </span>
                    <span className="text-xs text-[#7A7E8B]">
                      Page {bookSession.currentPage} of {bookSession.totalPages}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#1A1A1E]">
                      {bookSession.bookTitle}
                    </h4>
                    <p className="text-xs text-[#6B6F7B]">by {bookSession.author}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#52555F]">
                    <span>Rewritten: <strong>{bookSession.wordsRewritten.toLocaleString()} w</strong></span>
                    <span>•</span>
                    <span>Vocab: <strong>{bookSession.sessionVocabulary.length} words</strong></span>
                  </div>
                  <div className="pt-1">
                    <Link
                      to="/book-session"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F2E3D] hover:text-[#B85D38] transition-colors"
                    >
                      <span>Continue Rewriting in Split Screen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Weekly Challenge Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#E4DDD1] shadow-2xs hover:border-[#D5CDC0] transition-all flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] flex items-center justify-center shrink-0">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E]">
                      Weekly Challenge
                    </span>
                    <span className="text-xs font-semibold text-[#D97706]">
                      Due in 2 days
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#1A1A1E]">
                      "{challenges.theme}"
                    </h4>
                    <p className="text-xs text-[#6B6F7B]">
                      Write 300–500 words using at least 8 of your 12 weekly vocabulary words.
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[#52555F]">
                      Target Vocabulary: <strong>10 / 12 words ready</strong>
                    </span>
                    <Link
                      to="/challenges"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1F2E3D] hover:underline"
                    >
                      <span>Open Challenge</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Writing Activity */}
          <div className="bg-white p-6 rounded-2xl border border-[#E4DDD1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1A1A1E]">
                  Recent Writing Activity
                </h3>
                <p className="text-xs text-[#6B6F7B]">
                  Your practice sessions, book rewrites, and deliberate revisions
                </p>
              </div>
              <span className="text-xs text-[#7A7E8B]">
                Last 7 days
              </span>
            </div>

            <div className="divide-y divide-[#F0EBE0]">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5] -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF0E6] text-[#B85D38] flex items-center justify-center shrink-0">
                      {activity.type === "Book Session" ? (
                        <BookOpen className="w-4 h-4" />
                      ) : activity.type === "Weekly Challenge" ? (
                        <Trophy className="w-4 h-4" />
                      ) : (
                        <PenTool className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-serif font-semibold text-xs text-[#1A1A1E]">
                        {activity.title}
                      </div>
                      <div className="text-[11px] text-[#7A7E8B] flex items-center gap-2 mt-0.5">
                        <span>{activity.timestamp}</span>
                        <span>•</span>
                        <span>{activity.wordCount} words</span>
                        <span>•</span>
                        <span>{activity.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#F4EFE6] text-[#4A4D55] font-medium border border-[#E5DFD4]">
                      {activity.status}
                    </span>
                    <button
                      onClick={() => {
                        if (activity.type === "Book Session") navigate("/book-session");
                        else if (activity.type === "Weekly Challenge") navigate("/challenges");
                        else navigate("/write");
                      }}
                      className="text-xs font-semibold text-[#1F2E3D] hover:underline cursor-pointer"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
