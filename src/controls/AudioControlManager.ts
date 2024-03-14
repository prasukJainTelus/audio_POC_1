import EventEmitter from "wavesurfer.js/dist/event-emitter.js";
import { IAnnotation, IRegion, IUpdateRegion } from "../interfaces/Interface";
import AnnotationManager from "./AnnotationManager";
import WaveFormManager from "./WaveFormManager";

export type ControlEvents = {
  "annotations-updated": [annotations: IAnnotation[]];
  "allow-region": [allow: boolean];
  "set-active-annotation": [annotation: IAnnotation | undefined];
};

class AudioControlManager extends EventEmitter<ControlEvents> {
  private waveFormManager?: WaveFormManager;
  private annotationManager?: AnnotationManager;
  public isPlaying = false;
  public waveZoom = 100;
  private activeAnnotation?: IAnnotation = undefined;
  constructor() {
    super();
    this.isPlaying = false;
  }

  public initializeAudioPlayer() {
    if (!this.waveFormManager) this.waveFormManager = new WaveFormManager();
    this.waveFormManager.unAll();
    this.waveFormManager.on("on-toggle-play", this.togglePlay.bind(this));
    this.waveFormManager.on(
      "on-region-created",
      this.onRegionCreated.bind(this)
    );
    this.waveFormManager.on(
      "on-region-updated",
      this.onRegionUpdated.bind(this)
    );
    this.waveFormManager.on("plugin-update", (active: boolean) => {
      this.emit("allow-region", active);
    });

    this.waveFormManager.on(
      "on-region-select",
      this.setActiveAnnotationName.bind(this)
    );
    if (!this.annotationManager)
      this.annotationManager = new AnnotationManager({
        onAnnotationUpdate: this.onAnnotationUpdate.bind(this),
      });
  }

  public togglePlay(play = !this.isPlaying) {
    if (!this.waveFormManager) return;
    this.waveFormManager.togglePlay(play);
    this.isPlaying = play;
  }

  setPlayBackSpeed(speed: number) {
    if (!this.waveFormManager) return;
    this.waveFormManager.setPlayBackSpeed(speed);
  }
  public setWaveZoom(zoom: number) {
    if (!this.waveFormManager) return;
    this.waveZoom = zoom;
    this.waveFormManager.setWaveZoom(zoom);
  }

  public enableRegion() {
    if (!this.waveFormManager) return;
    this.waveFormManager.enableRegion();
  }
  public disableRegion() {
    if (!this.waveFormManager) return;
    this.waveFormManager.disableRegion();
  }

  private onRegionCreated(region: IRegion) {
    if (!this.annotationManager) return;
    this.annotationManager.createAnnotation(region);
  }
  private onAnnotationUpdate(annotations: IAnnotation[]) {
    if (!this.waveFormManager) return;
    this.updateRegions();
    this.emit("annotations-updated", annotations);
  }

  public updateRegions() {
    if (!this.waveFormManager || !this.annotationManager) return;
    this.waveFormManager.updateRegions(
      this.annotationManager.getRegionalAnnotations()
    );
  }
  public getAnnotations() {
    if (!this.annotationManager) return [];
    return this.annotationManager.getAnnotations();
  }
  public setActiveAnnotationName(name: string) {
    const annotation = this.annotationManager?.findAnnotationByName(name);
    this.setActiveAnnotation(annotation);
  }

  public setActiveAnnotation(annotation: IAnnotation | undefined) {
    this.activeAnnotation = annotation;
    this.emit("set-active-annotation", annotation);
    if (!this.waveFormManager) return;
    this.waveFormManager.setActiveAnnotation(this.activeAnnotation);
  }

  private onRegionUpdated(region: IUpdateRegion) {
    if (!this.annotationManager) return;
    this.annotationManager.updateAnnotation(region);
  }
}

export default AudioControlManager;
