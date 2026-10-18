import React from "react";

const gain = (skill) => parseInt(skill.change, 10) || 0;

export const priorScore = (skill) => Math.round(skill.score / (1 + gain(skill) / 100));

export const SkillLegend = () => (
  <div className="flex flex-wrap gap-5 text-[12.5px] text-ink-3">
    <span className="flex items-center gap-2">
      <span className="w-4 h-2 rounded-sm bg-ink" aria-hidden="true" />
      Six weeks ago
    </span>
    <span className="flex items-center gap-2">
      <span className="w-4 h-2 rounded-sm bg-pen" aria-hidden="true" />
      Gained since
    </span>
  </div>
);

// Each skill as a bar split into where it stood six weeks ago (ink) and what was gained since (pen).
export const SkillBars = ({ skills }) => (
  <ul className="flex flex-col gap-5">
    {skills.map((skill, idx) => {
      const prior = priorScore(skill);
      return (
        <li key={skill.id}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="flex items-center gap-2.5 text-[15px] font-medium min-w-0">
              {skill.name}
              {skill.focus && <span className="tag tag-pen tag-caps">This week's focus</span>}
            </span>
            <span className="flex items-baseline gap-3 tabular">
              <span className="text-[13px] font-semibold text-good">{skill.change}</span>
              <span className="font-serif text-[26px] leading-none w-8 text-right">{skill.score}</span>
            </span>
          </div>
          <div className="track mt-2 flex" role="img" aria-label={`${skill.name}: ${prior} six weeks ago, ${skill.score} now`}>
            <span className="grow-x rounded-r-none" style={{ width: `${prior}%`, "--i": idx }} />
            <span className="grow-x bg-pen rounded-l-none" style={{ width: `${skill.score - prior}%`, "--i": idx }} />
          </div>
        </li>
      );
    })}
  </ul>
);
