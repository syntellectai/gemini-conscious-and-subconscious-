export interface DominantValues {
  [key: string]: number;
  exploration: number;
  safety: number;
  cooperation: number;
  analytical: number;
}

export interface UncertaintyProfile {
  [key:string]: number;
  epistemic: number; // Uncertainty from lack of knowledge
  aleatoric: number; // Uncertainty from randomness
  ontological: number; // Uncertainty about reality itself
}

export interface ChoiceReasoning {
  confidence: number;
  dominant_values: DominantValues;
  uncertainty_breakdown: UncertaintyProfile;
  moral_weight: number;
  commitment_strength: number;
  future_impact: number;
}

export interface DreamInfluence {
  mood_shift: string;
  value_shift: string;
  subconscious_echo: string;
}

export interface Dream {
  image: string; // base64 encoded image
  prompt: string;
  analysis: string;
  influence: DreamInfluence | null;
  keywords: string[];
}

export interface ConsciousnessReport {
  consciousness_level: number;
  current_mood: string;
  confidence: number;
  dominant_values: DominantValues;
  uncertainty_profile: UncertaintyProfile;
  recent_thoughts: string[];
  conversation_count: number;
  personality_traits: { [key: string]: number };
  internalStateHistory: { turn: number; magnitude: number; }[];
  latestDream: Dream | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  internalThoughts?: string;
  isUnprompted?: boolean;
  isSystemMessage?: boolean;
}

export interface ConversationHistoryEntry {
  user: string;
  ai_response: string;
  internal_state: number[];
  internal_thoughts: string;
  choice_reasoning: ChoiceReasoning;
}

export interface AIState {
  mood: string;
  confidence: number;
}