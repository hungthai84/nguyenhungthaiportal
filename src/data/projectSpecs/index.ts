import { ProjectDetailedSpec } from '@/types';
import { STRATEGY_AND_SOP_SPECS } from './strategyAndSopSpecs';
import { CX_SPECS } from './cxSpecs';
import { TECH_SPECS } from './techSpecs';
import { LEARNING_SPECS } from './learningSpecs';

export const ALL_PROJECT_DETAILED_SPECS: Record<string, ProjectDetailedSpec> = {
  ...STRATEGY_AND_SOP_SPECS,
  ...CX_SPECS,
  ...TECH_SPECS,
  ...LEARNING_SPECS,
};
