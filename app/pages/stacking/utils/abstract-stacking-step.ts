import { StackingStepView } from './use-stacking-form-step';

export interface StackingStepBaseProps {
  title: string;
  step?: number;
  isComplete: boolean;
  state: StackingStepView;
}
