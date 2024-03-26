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

export interface BaseResponse {
  total_count: number;
}
