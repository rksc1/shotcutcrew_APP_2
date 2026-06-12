import { create } from "zustand";
import type { BudgetTier } from "@/lib/constants";

export interface BookingState {
  // Step 1: Event Type
  eventType: string | null;
  customEventType: string | null;

  // Step 2: Setup Type
  setupType: "on_location" | "studio" | "outdoor" | null;

  // Step 3: Crew Requirements
  crewRequirements: Record<string, number>;

  // Step 4: Equipment Requirements
  equipmentRequirements: Record<string, boolean>;
  postProductionServices: string[];

  // Step 5: Logistics
  eventDate: string | null;
  bookingLocation: string | null;
  estimatedDays: number;
  budgetTier: BudgetTier | null;
  additionalNotes: string;

  // Computed / derived
  currentStep: number;
  totalSteps: number;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;

  setEventType: (type: string, custom?: string) => void;
  setSetupType: (type: BookingState["setupType"]) => void;
  setCrewCount: (role: string, count: number) => void;
  toggleEquipment: (id: string) => void;
  togglePostProduction: (id: string) => void;
  setLogistics: (data: {
    eventDate?: string | null;
    bookingLocation?: string | null;
    estimatedDays?: number;
    budgetTier?: BudgetTier | null;
    additionalNotes?: string;
  }) => void;

  reset: () => void;

  // Computed helpers (as getters)
  getTitle: () => string;
  getDescription: () => string;
  getBudget: () => number;
  getRequirementSummary: () => string;
  isStepValid: () => boolean;
}

const BUDGET_MAP: Record<string, number> = {
  budget: 15000,
  standard: 60000,
  premium: 150000,
};

const DEFAULT_STATE = {
  eventType: null,
  customEventType: null,
  setupType: null,
  crewRequirements: {},
  equipmentRequirements: {},
  postProductionServices: [],
  eventDate: null,
  bookingLocation: null,
  estimatedDays: 1,
  budgetTier: null,
  additionalNotes: "",
  currentStep: 1,
  totalSteps: 7,
};

export const useBookingStore = create<BookingState>((set, get) => ({
  ...DEFAULT_STATE,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, s.totalSteps) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 1) })),

  setEventType: (type, custom) => set({ eventType: type, customEventType: custom ?? null }),
  setSetupType: (type) => set({ setupType: type }),

  setCrewCount: (role, count) =>
    set((s) => ({
      crewRequirements: count > 0
        ? { ...s.crewRequirements, [role]: count }
        : Object.fromEntries(Object.entries(s.crewRequirements).filter(([k]) => k !== role)),
    })),

  toggleEquipment: (id) =>
    set((s) => ({
      equipmentRequirements: {
        ...s.equipmentRequirements,
        [id]: !s.equipmentRequirements[id],
      },
    })),

  togglePostProduction: (id) =>
    set((s) => ({
      postProductionServices: s.postProductionServices.includes(id)
        ? s.postProductionServices.filter((x) => x !== id)
        : [...s.postProductionServices, id],
    })),

  setLogistics: (data) => set(data as Partial<BookingState>),

  reset: () => set({ ...DEFAULT_STATE }),

  getTitle: () => {
    const s = get();
    if (!s.eventType) return "Custom Shoot";
    const label = s.customEventType || s.eventType.replace(/_/g, " ");
    return label.charAt(0).toUpperCase() + label.slice(1);
  },

  getDescription: () => {
    const s = get();
    const parts: string[] = [];
    if (s.eventType) parts.push(`Event: ${s.getTitle()}`);
    if (s.setupType) parts.push(`Setup: ${s.setupType.replace(/_/g, " ")}`);
    if (s.bookingLocation) parts.push(`Location: ${s.bookingLocation}`);
    if (s.eventDate) parts.push(`Date: ${s.eventDate}`);
    const crew = Object.entries(s.crewRequirements)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `${v}x ${k.replace(/_/g, " ")}`)
      .join(", ");
    if (crew) parts.push(`Crew: ${crew}`);
    if (s.additionalNotes) parts.push(s.additionalNotes);
    return parts.join(". ") || "Custom production requirement";
  },

  getBudget: () => {
    const s = get();
    return BUDGET_MAP[s.budgetTier ?? "standard"] ?? 60000;
  },

  getRequirementSummary: () => {
    return get().getDescription();
  },

  isStepValid: () => {
    const s = get();
    switch (s.currentStep) {
      case 1: return !!s.eventType;
      case 2: return !!s.setupType;
      case 3: return Object.values(s.crewRequirements).some((v) => v > 0);
      case 4: return true; // equipment is optional
      case 5: return !!s.bookingLocation;
      case 6: return true; // review step
      case 7: return true;
      default: return false;
    }
  },
}));
