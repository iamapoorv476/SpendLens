"use client"

import { ToolName, ToolEntry } from "@/src/lib/types"

const TOOLS: ToolName[] = [
  "Cursor",
  "GitHub Copilot",
  "Claude",
  "ChatGPT",
  "Anthropic API",
  "OpenAI API",
  "Gemini",
  "Windsurf",
]

const PLANS: Record<ToolName, string[]> = {
  "Cursor": ["Hobby", "Pro", "Pro+", "Ultra", "Teams", "Enterprise"],
  "GitHub Copilot": ["Free", "Pro", "Pro+", "Business", "Enterprise"],
  "Claude": ["Free", "Pro", "Max 5x", "Max 20x", "Team", "Enterprise", "API direct"],
  "ChatGPT": ["Free", "Go", "Plus", "Pro 5x", "Pro 20x", "Business", "Enterprise", "API direct"],
  "Anthropic API": ["API direct"],
  "OpenAI API": ["API direct"],
  "Gemini": ["Free", "AI Plus", "AI Pro", "AI Ultra", "API"],
  "Windsurf": ["Free", "Pro", "Teams", "Enterprise"],
}

type StepTwoProps = {
  selectedTools: Set<ToolName>
  tools: ToolEntry[]
  onToggleTool: (toolName: ToolName) => void
  onNext: () => void
  onBack: () => void
}

export function StepTwo({
  selectedTools,
  tools,
  onToggleTool,
  onNext,
  onBack,
}: StepTwoProps) {
  return (
    <div className="space-y-8">
      <div>
        <p className="mono text-xs text-[#444] tracking-widest mb-2">
          STEP 02
        </p>
        <h2 className="text-2xl font-bold mb-1">
          Which tools do you pay for?
        </h2>
        <p className="text-sm text-[#555]">
          Select all that apply. Free plans count too.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TOOLS.map((tool) => {
          const isSelected = selectedTools.has(tool)
          return (
            <button
              key={tool}
              onClick={() => onToggleTool(tool)}
              className={`px-4 py-4 text-sm border transition-all text-left flex items-center gap-3 ${
                isSelected
                  ? "border-[#00ff88] text-[#00ff88] bg-[rgba(0,255,136,0.05)]"
                  : "border-[#1a1a1a] text-[#555] hover:border-[#333] hover:text-[#888]"
              }`}
            >
              {/* Checkbox indicator */}
              <span
                className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center text-xs transition-all ${
                  isSelected
                    ? "border-[#00ff88] bg-[#00ff88] text-black"
                    : "border-[#333]"
                }`}
              >
                {isSelected && "✓"}
              </span>
              <span className="leading-tight">{tool}</span>
            </button>
          )
        })}
      </div>

      {selectedTools.size === 0 && (
        <p className="text-xs text-[#333] text-center py-2 mono">
          select at least one tool to continue
        </p>
      )}

      {/* Selected count */}
      {selectedTools.size > 0 && (
        <p className="text-xs text-[#444] mono">
          {selectedTools.size} tool{selectedTools.size > 1 ? "s" : ""} selected
        </p>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={onBack} className="btn-ghost flex-1">
          ← BACK
        </button>
        <button
          onClick={onNext}
          disabled={selectedTools.size === 0}
          className="btn-primary flex-1 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          NEXT: SPENDING →
        </button>
      </div>
    </div>
  )
 }

export { PLANS, TOOLS }