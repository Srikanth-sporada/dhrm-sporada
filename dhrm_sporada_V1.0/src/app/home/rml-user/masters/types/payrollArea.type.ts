export type PayrollArea = {
  PlantCode: string;
  PayrollArea: string;
  StartDay: number;
  EndDay: number;
  Grace_minutes: string;
  InsertBy: string;
  InsertDate?: string; // ISO date string
  UpdateBy: string;
  UpdateDate?: string; // ISO date string
  week_off_eligibility:any,
};