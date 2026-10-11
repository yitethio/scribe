import React from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Award,
  AlertTriangle,
  Sparkles,
  BarChart2,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Flame,
  Layers,
  BookOpen
} from "lucide-react";
import { useScribe } from "../store/scribeContext";
import { AppLayout } from "../components/layout/AppLayout";

export default function Progress() {
  const { state } = useScribe();
  const { user, skills, vocabulary } = state;

  return (
    <AppLayout
      title="Writing Progress & Diagnostics"
      subtitle="Longitudinal skill trajectories, retention diagnostics & pattern detection"
    >
      <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-150">
        {/* Top Diagnostic Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Vocabulary Acquisition Health */}
          <div className="bg-white p-6 rounded-2xl border border-[#E4DDD1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
                  Lexical Growth
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1A1A1E]">
                  Vocabulary Breakdown
                </h3>
              </div>
              <span className="font-mono text-sm font-bold text-[#059669]">
                71% Retention
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE7DC]">
                <div className="text-[11px] text-[#7A7E8B]">Total Learned</div>
                <div className="font-serif font-bold text-2xl text-[#1A1A1E]">
                  147
                </div>
                <div className="text-[10px] text-[#059669] font-medium mt-0.5">
                  +12 this week
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE7DC]">
                <div className="text-[11px] text-[#7A7E8B]">Successfully Used</div>
                <div className="font-serif font-bold text-2xl text-[#1F2E3D]">
                  83
                </div>
                <div className="text-[10px] text-[#059669] font-medium mt-0.5">
                  Natural collocations
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE7DC]">
                <div className="text-[11px] text-[#7A7E8B]">Needs Reinforcement</div>
                <div className="font-serif font-bold text-2xl text-[#D97706]">
                  21
                </div>
                <div className="text-[10px] text-[#D97706] font-medium mt-0.5">
                  Scheduled for spaced drill
                </div>
              </div>

              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EDE7DC]">
                <div className="text-[11px] text-[#7A7E8B]">Repeatedly Misused</div>
                <div className="font-serif font-bold text-2xl text-[#B85D38]">
                  11
                </div>
                <div className="text-[10px] text-[#B85D38] font-medium mt-0.5">
                  Collocation collisions
                </div>
              </div>
            </div>
          </div>

          {/* Skill Diagnostic Bars */}
          <div className="bg-white p-6 rounded-2xl border border-[#E4DDD1] shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
                  Editorial Calibration
                </span>
                <h3 className="font-serif font-bold text-lg text-[#1A1A1E]">
                  Core Writing Dimensions
                </h3>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FAF0E6] text-[#B85D38] font-bold">
                Level IV Benchmark
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {skills.map((skill) => (
                <div key={skill.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1A1A1E]">{skill.name}</span>
                    <span className="font-mono font-bold text-[#1A1A1E]">{skill.score}/100</span>
                  </div>
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
          </div>
        </div>

        {/* Longitudinal Improvement Callout */}
        <div className="p-6 bg-white border border-[#E4DDD1] rounded-2xl shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#059669]">
              Longitudinal Trend
            </span>
            <h3 className="font-serif font-bold text-xl text-[#1A1A1E]">
              Your cohesion score improved 14% over the last 6 weeks
            </h3>
            <p className="text-xs text-[#6B6F7B]">
              Consistent practice in Revision Mode and Book Rewrite sessions has eliminated weak paragraph transitions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE7DC] text-center">
              <div className="text-[10px] text-[#7A7E8B]">Week 36</div>
              <div className="font-serif font-bold text-sm text-[#6B6F7B]">47 / 100</div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#8A8D96]" />
            <div className="p-3 bg-[#ECFDF5] rounded-xl border border-[#A7F3D0] text-center">
              <div className="text-[10px] text-[#065F46]">Current</div>
              <div className="font-serif font-bold text-base text-[#065F46]">61 / 100</div>
            </div>
          </div>
        </div>

        {/* Pattern Detection Intelligence */}
        <div className="bg-[#FAF7F0] p-6 rounded-2xl border border-[#E8E1D3] shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#FAF0E6] text-[#B85D38]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85D38]">
                AI Cognitive Diagnostic
              </span>
              <h3 className="font-serif font-bold text-lg text-[#1A1A1E]">
                Pattern Detected in Your Prose
              </h3>
            </div>
          </div>

          <blockquote className="p-4 bg-white rounded-xl border border-[#E2DBD0] font-serif text-sm text-[#252830] italic leading-relaxed">
            "You frequently use advanced vocabulary correctly in isolation, but sometimes reach for terms that are more complicated than necessary, creating dense syntactic clusters."
          </blockquote>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <div className="text-xs font-bold text-[#1A1A1E]">
                Recommended Focus: Precision and Simplicity
              </div>
              <p className="text-[11px] text-[#6B6F7B]">
                Practice replacing Latinate multisyllable words with vigorous, direct Anglo-Saxon verbs.
              </p>
            </div>

            <Link
              to="/revision-mode"
              className="px-4 py-2 bg-[#1F2E3D] hover:bg-[#15202B] text-white text-xs font-semibold rounded-xl shrink-0 cursor-pointer shadow-2xs"
            >
              Start Targeted Exercises
            </Link>
          </div>
        </div>

        {/* 30-Day Writing Habit Heatmap */}
        <div className="bg-white p-6 rounded-2xl border border-[#E4DDD1] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1E]">
                Writing Consistency Heatmap
              </h3>
              <p className="text-xs text-[#7A7E8B]">
                Daily deliberate sessions logged over the past 30 days
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B6F7B]">
              <span>Less</span>
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded-xs bg-[#F0EAE0]" />
                <span className="w-3 h-3 rounded-xs bg-[#D5CDC0]" />
                <span className="w-3 h-3 rounded-xs bg-[#B85D38]" />
                <span className="w-3 h-3 rounded-xs bg-[#1F2E3D]" />
              </div>
              <span>More</span>
            </div>
          </div>

          <div className="grid grid-cols-10 sm:grid-cols-15 gap-2 pt-2">
            {Array.from({ length: 30 }).map((_, i) => {
              const intensity = i % 4 === 0 ? "bg-[#1F2E3D]" : i % 3 === 0 ? "bg-[#B85D38]" : i % 2 === 0 ? "bg-[#D5CDC0]" : "bg-[#F0EAE0]";
              return (
                <div
                  key={i}
                  className={`h-6 rounded-md ${intensity} transition-all hover:scale-110 cursor-pointer`}
                  title={`Day ${i + 1}: ${i % 2 === 0 ? "Active writing session logged" : "Rest"}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
