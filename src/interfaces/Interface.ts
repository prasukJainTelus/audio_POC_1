export interface IRegion {
  start: number;
  end: number;
}

export interface IAnnotation {
  start: number;
  end: number;
  color: string;
  attribute: object;
}
