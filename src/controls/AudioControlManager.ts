import EventEmitter from "wavesurfer.js/dist/event-emitter.js";
import { IAnnotation, IRegion } from "../interfaces/Interface";
import AnnotationManager from "./AnnotationManager";
import WaveFormManager from "./WaveFormManager";

export type ControlEvents = {
  "annotations-updated": [annotations: IAnnotation[]];
  "allow-region": [allow: boolean];
  "set-active-annotation": [annotation: number];
};

class AudioControlManager extends EventEmitter<ControlEvents> {
  private waveFormManager?: WaveFormManager;
  private annotationManager?: AnnotationManager;
  public isPlaying = false;
  public waveZoom = 100;
  public activeAnnotation?: IAnnotation = undefined;
  constructor() {
    super();
    this.isPlaying = false;
  }

  public initializeAudioPlayer() {
    if (!this.waveFormManager)
      this.waveFormManager = new WaveFormManager({
        onTogglePlay: this.togglePlay.bind(this),
        onRegionCreated: this.onRegionCreated.bind(this),
      });
    this.waveFormManager.on("plugin-update", (active: boolean) => {
      this.emit("allow-region", active);
    });

    this.waveFormManager.on(
      "on-region-select",
      this.setActiveAnnotation.bind(this)
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
    console.log("onR", region);

    if (!this.annotationManager) return;
    this.annotationManager.createAnnotation(region);
  }
  private onAnnotationUpdate(annotations: IAnnotation[]) {
    if (!this.waveFormManager) return;

    this.waveFormManager.updateRegions(annotations);
    this.emit("annotations-updated", annotations);
  }

  public getAnnotations() {
    if (!this.annotationManager) return [];
    return this.annotationManager.getAnnotations();
  }

  private setActiveAnnotation(index: number) {
    if (!this.annotationManager) return;
    const anns = this.annotationManager.getAnnotations();
    this.activeAnnotation = anns[index];
    this.emit("set-active-annotation", index);
  }
}

export default AudioControlManager;
