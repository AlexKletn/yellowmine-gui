export default interface Project {
  id: number;
  name: string;
  identifier: string;
  description: string;
  status: number;
  parent: number;
  created_on: string;
  updated_on: string;

  custom_fields: Array<{
    id: number;
    name: string;
    value: string;
  }>;

  [key: string]: unknown;
}
