import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Compass,
  Sparkles,
  BookOpen,
  ArrowRight,
  Target,
  Clock,
  Shield,
  Award,
  Layers,
  Edit2
} from "lucide-react";
import { useScribe } from "../store/scribeContext";
import { AppLayout } from "../components/layout/AppLayout";

export default function WritingProfile() {
  const { state } = useScribe();
  const { user, vocabulary, skills } = state;

  const [activeGoal, setActiveGoal] = useState("5000");

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
      title: "Prepositional Collocations",
      detail: "Tendency to pair verbs and nouns with non-standard prepositions (e.g. 'influence to' instead of 'influence on')."
    },
    {
      title: "Article Usage (A / An / The)",
      detail: "Occasional omission of definite articles when introducing specific abstract concepts."
    },
    {
      title: "Excessive Sentence Length",
      detail: "Sentences occasionally exceed 35 words by compounding multiple dependent clauses."
    },
    {
      title: "Weak Transitions Between Paragraphs",
      detail: "Shifting to new arguments without clear transitional markers or contrastive bridges."
    }
  ];

  return (
    <AppLayout
      title="Personal Writing Profile"
      subtitle="Cognitive tendencies, stylistic strengths, and tailored pedagogical prescriptions"
    >
      <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-150">
        {/* Author Bio Banner with photo */}
        <div className="bg-white p-6 rounded-2xl border border-[#E4DDD1] shadow-2xs flex flex-col md:flex-row items-center md:items-start gap-6">
          <img
            src={user.avatar || "/avatar.jpg"}
            alt={user.name}
            className="w-24 h-24 rounded-2xl object-cover border border-[#DDD6C9] shadow-xs shrink-0"
          />

          <div className="space-y-2 flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="font-serif font-bold text-2xl text-[#1A1A1E]">
                  {user.name}
                </h2>
                <p className="text-xs font-semibold text-[#B85D38] mt-0.5">
                  {user.role}
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FAF0E6] text-[#B85D38] border border-[#F2DFCD] self-center md:self-auto">
                Stylistic Archetype: Analytical Realist
              </span>
            </div>

            <p className="text-xs text-[#52555F] leading-relaxed max-w-2xl">
              Committed to deliberate prose mastery through daily rewriting, precise vocabulary acquisition, and iterative self-revision. Scribe adapts its coaching levels as your syntactical independence grows.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-[#6B6F7B]">
              <span>Streak: <strong>{user.streakDays} days</strong></span>
              <span>•</span>
              <span>Learned: <strong>{vocabulary.length} words</strong></span>
              <span>•</span>
              <span>Monthly Volume: <strong>{user.wordsWrittenThisMonth.toLocaleString()} words</strong></span>
            </div>
          </div>
        </div>

        {/* Section: What I've Learned About Your Writing */}
        <div className="bg-white p-8 rounded-2xl border border-[#E4DDD1] shadow-2xs space-y-6">
          <div className="border-b border-[#E8E2D8] pb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85D38]">
              Long-Term Analysis
            </span>
            <h3 className="font-serif font-bold text-xl text-[#1A1A1E]">
              What I've Learned About Your Writing
            </h3>
            <p className="text-xs text-[#6B6F7B] mt-0.5">
              Accumulated observations across 15 sessions, book rewrites, and challenge submissions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#059669]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Demonstrated Strengths</span>
              </div>

              <div className="space-y-2.5">
                {strengths.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EBE4D8] space-y-1"
                  >
                    <div className="font-serif font-semibold text-xs text-[#1A1A1E]">
                      {item.title}
                    </div>
                    <p className="text-[11px] text-[#555862] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Weaknesses */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D97706]">
                <AlertTriangle className="w-4 h-4" />
                <span>Current Weaknesses to Target</span>
              </div>

              <div className="space-y-2.5">
                {weaknesses.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-[#FFFBEB] rounded-xl border border-[#FDE68A] space-y-1"
                  >
                    <div className="font-serif font-semibold text-xs text-[#92400E]">
                      {item.title}
                    </div>
                    <p className="text-[11px] text-[#78350F] leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Current Focus & Recommended Drill */}
        <div className="p-8 bg-[#F5EFE4] border border-[#E2D8C7] rounded-2xl shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#1F2E3D] text-white">
              <Compass className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85D38]">
                Prescribed Learning Strategy
              </span>
              <h3 className="font-serif font-bold text-xl text-[#1A1A1E]">
                Current Focus: {user.currentFocus.title}
              </h3>
            </div>
          </div>

          <p className="font-serif text-xs text-[#3E424B] leading-relaxed max-w-2xl">
            "{user.currentFocus.description}"
          </p>

          <div className="p-4 bg-white rounded-xl border border-[#D5CDC0] space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8D96]">
              Personalized Targeted Drill
            </div>
            <p className="font-serif italic text-xs text-[#1A1A1E]">
              "{user.currentFocus.recommendation}"
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/write"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1F2E3D] hover:bg-[#15202B] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Launch Targeted Drill in Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}