import {
  AnnotationType,
  IAnnotation,
  IRegion,
  IRegionAnnotation,
  IUpdateRegion,
} from "../../interfaces/Interface";

interface IConfig {
  onAnnotationUpdate?: (annotation: IAnnotation[]) => void;
}
class AnnotationManager {
  private annotations: IAnnotation[];
  private onAnnotationUpdate = (annotations: IAnnotation[]) =>
    console.log(annotations);

  constructor(config: IConfig) {
    this.annotations = [
      {
        id: 0,
        name: `Track Annotation 1`,
        type: AnnotationType.TRACK,
        attribute: { alpha: "beta" },
      },
    ];
    if (config.onAnnotationUpdate)
      this.onAnnotationUpdate = config.onAnnotationUpdate;
  }

  public createAnnotation(region: IRegion) {
    this.annotations.push({
      id: this.annotations.length,
      name: `Region Annotation ${this.annotations.length}`,
      type: AnnotationType.REGION,
      start: region.start,
      end: region.end,
      color: "rgba(255, 0, 0, 0.1)",
      attribute: {},
    });
    this.onAnnotationUpdate(this.annotations);
  }

  public getAnnotations() {
    return this.annotations;
  }

  public getRegionalAnnotations(): IRegionAnnotation[] {
    return this.annotations.filter(
      (a) => a.type === AnnotationType.REGION
    ) as IRegionAnnotation[];
  }

  public updateAnnotation(annotation: IUpdateRegion) {
    const selectedAnnotation = this.annotations.find(
      (e) => e.name === annotation.name
    );
    if (
      !selectedAnnotation ||
      selectedAnnotation.type !== AnnotationType.REGION
    )
      return;
    selectedAnnotation.start = annotation.start;
    selectedAnnotation.end = annotation.end;
    this.onAnnotationUpdate(this.annotations);
  }
  public findAnnotationByName(name: string) {
    return this.annotations.find((a) => a.name === name);
  }
}
export default AnnotationManager;
