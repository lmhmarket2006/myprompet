export interface PromptAnalysis {
  coreGoal: string;
  hiddenGoal: string;
  taskType: string;
  targetAudience: string;
  complexityLevel: string;
  domain: string;
  idealOutputs: string;
}

export interface MissingElement {
  element: string;
  status: string;
  description: string;
}

export interface FinalPrompt {
  role: string;
  context: string;
  objective: string;
  input: string;
  requirements: string;
  constraints: string;
  qualityStandards: string;
  reasoningFramework: string;
  outputFormat: string;
  fullAssembledPrompt: string;
}

export interface PromptEvaluation {
  score: number;
  strengths: string[];
  appliedImprovements: string[];
  additionalSuggestions: string[];
}

export interface StructuredResult {
  analysis: PromptAnalysis;
  category: string;
  engineeringFramework: string;
  missingElements: MissingElement[];
  finalPrompt: FinalPrompt;
  evaluation: PromptEvaluation;
}

export interface OptimizationResult {
  rawText: string;
  structured: StructuredResult;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  rawInput: string;
  category: string;
  result: OptimizationResult;
}
