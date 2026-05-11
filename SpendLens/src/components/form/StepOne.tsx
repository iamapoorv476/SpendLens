"use client"

import { UseCase, ExtendedUserInput } from "@/src/lib/types"

type StepOneProps = {
    input: ExtendedUserInput
    onUpdate: <K extends keyof ExtendedUserInput>(
        field: K,
        value: ExtendedUserInput[K]
    ) => void
    onNext: () => void
}

export function StepOne({input, onUpdate, onNext}: StepOneProps) {
    return(
        <div className="space-y-8">
            <div>
                <p className="mono text-xs text-[#444] tracking-widest mb-2">
                    STEP 01
                </p>
                <h2 className="text-2xl font-bold mb-1">About your team</h2>
                <p className="text-sm text-[#555]">
                    This shapes every recommendation we make.
                </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium block">
                Team size
              </label>  
              <input
                type="number"
                min={1}
                max={10000}
                value={input.teamSize}
                onChange={(e) => 
                    onUpdate("teamSize", parseInt(e.target.value) || 1)
                }
                className="mono w-24 bg-[#111] border border-[#222] px-3 py-2 text-sm focus:border-[#00ff88] focus:outline-none transition-colors"
               />
               <p className="text-xs text-[#444]">
                   Include everyone who uses AI tools
               </p>
            </div>

            <div className="space-y-2">
        <label className="text-sm font-medium block">
          Primary use case
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(["coding", "writing", "research", "data", "mixed"] as UseCase[]).map(
            (uc) => (
              <button
                key={uc}
                onClick={() => onUpdate("useCase", uc)}
                className={`px-4 py-3 text-sm border transition-all text-left capitalize ${
                  input.useCase === uc
                    ? "border-[#00ff88] text-[#00ff88] bg-[rgba(0,255,136,0.05)]"
                    : "border-[#1a1a1a] text-[#555] hover:border-[#333]"
                }`}
              >
                {uc}
              </button>
            )
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium block">
          How intensively does your team use AI tools?
        </label>
        <div className="space-y-2">
          {[
            { value: "light", label: "Light", desc: "A few times a day" },
            { value: "moderate", label: "Moderate", desc: "Several hours a day" },
            { value: "heavy", label: "Heavy", desc: "AI is running almost constantly" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                onUpdate(
                  "usageIntensity",
                  opt.value as "light" | "moderate" | "heavy"
                )
              }
              className={`w-full px-4 py-3 text-sm border transition-all text-left flex items-center justify-between ${
                input.usageIntensity === opt.value
                  ? "border-[#00ff88] text-[#00ff88] bg-[rgba(0,255,136,0.05)]"
                  : "border-[#1a1a1a] text-[#555] hover:border-[#333]"
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              <span className="text-xs opacity-60">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 border border-[#1a1a1a]">
        <input
          type="checkbox"
          id="compliance"
          checked={input.hasComplianceRequirements}
          onChange={(e) =>
            onUpdate("hasComplianceRequirements", e.target.checked)
          }
          className="mt-0.5 accent-[#00ff88]"
        />
        <div>
          <label
            htmlFor="compliance"
            className="text-sm font-medium cursor-pointer block"
          >
            We have compliance requirements
          </label>
          <p className="text-xs text-[#444] mt-1">
            SOC 2, HIPAA, GDPR, or client contracts requiring enterprise
            security. We will never recommend removing these protections.
          </p>
        </div>
      </div>


      <button
        onClick={onNext}
        className="btn-primary w-full text-center"
      >
        NEXT: SELECT TOOLS →
      </button>
        </div>
    )
}