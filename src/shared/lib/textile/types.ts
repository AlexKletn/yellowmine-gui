export type AstNode<Meta = unknown> = {
  type: string;
  variant?: string;

  meta?: Meta;
  content?: (AstNode | string)[] | string;
};

export type SavePart = (c: string) => string;
