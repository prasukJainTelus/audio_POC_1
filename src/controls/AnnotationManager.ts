import { IAnnotation, IRegion } from "../interfaces/Interface";

interface IConfig {
  onAnnotationUpdate?: (annotation: IAnnotation[]) => void;
}
class AnnotationManager {
  private annotations: IAnnotation[];
  private onAnnotationUpdate = (annotations: IAnnotation[]) =>
    console.log(annotations);

  constructor(config: IConfig) {
    this.annotations = [];
    if (config.onAnnotationUpdate)
      this.onAnnotationUpdate = config.onAnnotationUpdate;
  }

  public createAnnotation(region: IRegion) {
    this.annotations.push({
      start: region.start,
      end: region.end,
      color: "rgba(255, 0, 0, 0.1)",
      attribute: {},
    });
    console.log(this.annotations);

    this.onAnnotationUpdate(this.annotations);
  }

  public getAnnotations() {
    return this.annotations;
  }
}
export default AnnotationManager;
