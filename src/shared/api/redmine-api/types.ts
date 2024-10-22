export interface BaseModel {
  id: number;
  created_on: string;
  updated_on: string;
}

export interface DefinitionRecord {
  id: number;
  name: string;
  value?: string;
}

export type BaseResponse<T> = T & {
  total_count: number;
};
