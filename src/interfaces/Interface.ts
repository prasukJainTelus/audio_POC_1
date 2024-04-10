export interface IRegion {
  start: number;
  end: number;
}

export interface IUpdateRegion extends IRegion {
  name: string;
}

export enum AnnotationType {
  REGION = "region",
  TRACK = "track",
}

export interface IBaseAnnotation {
  type: AnnotationType;
  name: string;
  id: number;
  attribute: object;
}
export interface ITrackAnnotation extends IBaseAnnotation {
  type: AnnotationType.TRACK;
}
export interface IRegionAnnotation extends IBaseAnnotation {
  type: AnnotationType.REGION;
  start: number;
  end: number;
  color: string;
}
export type IAnnotation = ITrackAnnotation | IRegionAnnotation;
