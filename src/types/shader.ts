export interface ShaderMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  date: string;
}

export interface ShaderData extends ShaderMeta {
  fragSource: string;
  metalSource: string;
}

export interface ShaderIndex {
  shaders: ShaderMeta[];
}

export interface ShaderParameter {
  id: string;
  label: string;
  type: "color" | "float" | "int";
  value: number | [number, number, number];
  min?: number;
  max?: number;
  step?: number;
  lineNumber: number;
  matchStart: number;
  matchEnd: number;
  originalText: string;
}
