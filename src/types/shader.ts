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
