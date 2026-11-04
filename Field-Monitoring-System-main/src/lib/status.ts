import { differenceInDays } from "date-fns";

export type FieldStatus = "Active" | "At Risk" | "Completed";

interface FieldWithUpdates {
  plantingDate: Date;
  stage: string;
  updates: {
    createdAt: Date;
    stageAtUpdate: string;
  }[];
}

export function calculateFieldStatus(field: FieldWithUpdates): FieldStatus {
  const today = new Date();
  const daysSincePlanting = differenceInDays(today, new Date(field.plantingDate));
  
  // 1. Completed
  if (field.stage === "HARVESTED") {
    return "Completed";
  }

  // 2. At Risk calculation
  const lastUpdate = field.updates.length > 0 ? field.updates[0] : null;
  const daysSinceLastUpdate = lastUpdate 
    ? differenceInDays(today, new Date(lastUpdate.createdAt)) 
    : daysSincePlanting; // Fallback to planting if no updates

  // Check condition 4: stage has been the same for > 30 days without new notes
  // (We'll assume 'updates' includes all stage changes and notes)
  const lastStageChange = field.updates.find(u => u.stageAtUpdate !== field.stage);
  const daysInCurrentStage = lastStageChange 
     ? differenceInDays(today, new Date(lastStageChange.createdAt)) 
     : daysSincePlanting;

  const isAtRisk = 
    (field.stage === "GROWING" && daysSincePlanting > 90) ||
    (field.stage === "READY" && daysSincePlanting > 120) ||
    (daysSinceLastUpdate > 14 && field.stage !== "HARVESTED") ||
    (daysInCurrentStage > 30 && field.updates.length <= 1); // Simple heuristic for "unchanged with no notes"

  if (isAtRisk) {
    return "At Risk";
  }

  // 3. Active
  return "Active";
}
