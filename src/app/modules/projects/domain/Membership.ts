export interface Membership {
  id: number;
  user: {
    id: number;
    name: string;
  };
  roles: Array<{
    id: number;
    name: string;
  }>;
}
