
export type UseCase =
  | "coding"
  | "writing"
  | "research"
  | "data"
  | "mixed"

export type ToolName =
  | "Cursor"
  | "GitHub Copilot"
  | "Claude"
  | "ChatGPT"
  | "Anthropic API"
  | "OpenAI API"
  | "Gemini"
  | "Windsurf"

export type ToolEntry = {
    name: ToolName
    plan: string   // e.g. "Pro", "Business"
    seats: number
    monthlySpend: number
}

export type UserInput = {
    teamSize: number
    useCase: UseCase
    tools: ToolEntry[]
}


export type SavingsType =
  | "downgrade"       // cheaper plan from same vendor
  | "switch"          // different tool entirely
  | "remove"          // redundant, remove it
  | "optimize"        // same tool, fewer seats or better plan fit
  | "credits"         // could buy through Credex credits instead


export type ToolRecommendation = {
    toolName: ToolName
    currentPlan: string
    currentSpend: number
    recommendedAction: string 
    savingsType: SavingsType
    monthlySavings: number
    annualSavings: number
    reason: string              
    isOptimal: boolean
}

export type AuditResult = {
    recommendations: ToolRecommendation[]
    totalMonthlySavings: number
    totalAnnualSavings: number
    isAlreadyOptimal: boolean   
    highSavings: boolean        
    lowSavings: boolean         
    summary: string   
}

export type Lead = {
  email: string
  company?: string
  role?: string
  teamSize?: number
  auditId: string
}


export type StoredAudit = {
  id: string            // nanoid, used in shareable URL
  input: UserInput      // what the user entered
  result: AuditResult   // what the engine returned
  createdAt: string     // ISO timestamp
}


export type PublicAudit = {
  id: string
  tools: ToolEntry[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  recommendations: ToolRecommendation[]
  createdAt: string
}