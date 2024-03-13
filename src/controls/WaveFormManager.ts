/* eslint-disable @typescript-eslint/ban-ts-comment */
import WaveSurfer from "wavesurfer.js";
import Regions from "wavesurfer.js/dist/plugins/regions.esm.js";
import { IAnnotation, IRegion } from "../interfaces/Interface";
import EventEmitter from "wavesurfer.js/dist/event-emitter.js";

export type WaveFormEvents = {
  "plugin-update": [state: boolean];
  "on-region-select": [region: number];
};

interface IConfig {
  onTogglePlay?: (play: boolean) => void;
  onRegionCreated?: (region: IRegion) => void;
}
class WaveFormManager extends EventEmitter<WaveFormEvents> {
  private wavesurfer: WaveSurfer | undefined = undefined;
  onTogglePlay = (play: boolean) => this.togglePlay(play);
  onRegionCreated = (region: IRegion) => console.log(region);

  wsRegions: Regions;
  disableDragSelection?: () => void;

  constructor(config: IConfig) {
    super();
    if (!this.wavesurfer)
      this.wavesurfer = WaveSurfer.create({
        container: "#waveform",
        barWidth: 2,
        barHeight: 1,
        mediaControls: false,
        minPxPerSec: 400,
      });
    this.initiateWavesurfer();
    if (config.onTogglePlay) this.onTogglePlay = config.onTogglePlay;
    if (config.onRegionCreated) this.onRegionCreated = config.onRegionCreated;
    this.wsRegions = this.wavesurfer.registerPlugin(Regions.create());
  }

  public togglePlay(play: boolean) {
    if (!this.wavesurfer) return;
    if (play) this.wavesurfer.play();
    else this.wavesurfer.pause();
  }

  public setWaveZoom(zoom: number) {
    if (!this.wavesurfer) return;
    this.wavesurfer.zoom(zoom);
  }

  public setPlayBackSpeed(speed: number) {
    if (!this.wavesurfer) return;
    this.wavesurfer.setPlaybackRate(speed);
  }

  public enableRegion() {
    if (!this.wavesurfer) return;
    this.enableCreateAction();
    this.disableDragSelection = this.wsRegions.enableDragSelection({
      color: "rgba(255, 0, 0, 0.1)",
    });
  }

  public disableRegion() {
    this.disableDragSelection && this.disableDragSelection();
    this.emit("plugin-update", false);
  }

  private initiateWavesurfer() {
    if (!this.wavesurfer) return;
    this.wavesurfer.on("ready", () => {
      this.wavesurfer?.play();
    });

    this.wavesurfer.load("https://download.samplelib.com/mp3/sample-3s.mp3");
  }

  private enableRegionClick() {
    if (!this.wavesurfer) return;
    this.wsRegions.on("region-clicked", (region) => {
      region.play();
      this.emit("on-region-select", parseInt(region.id));
      this.wsRegions.once("region-out", () => this.onTogglePlay(false));
    });
  }

  public disableRegionActions() {
    if (!this.wavesurfer) return;
    this.wavesurfer.toggleInteraction(false);
    this.wsRegions.on("region-created", () => {});
    this.wsRegions.on("region-clicked", () => {});
    this.wsRegions.on("region-updated", () => {});
  }

  public enableRegionActions() {
    if (!this.wavesurfer) return;
    this.enableCreateAction();
  }

  enableUpdateAction() {
    this.wsRegions.on("region-updated", (region) => {
      region.remove();
      this.onRegionCreated({
        start: region.start,
        end: region.end,
      });
    });
  }
  enableCreateAction() {
    this.wsRegions.once("region-created", (region) => {
      console.log("region", region);

      region.remove();
      this.wsRegions.unAll();
      this.disableRegion();

      this.onRegionCreated({
        start: region.start,
        end: region.end,
      });
    });
  }
  public updateRegions(regions: IAnnotation[]) {
    if (!this.wavesurfer) return;
    this.wsRegions.clearRegions();
    regions.forEach((region, index) => {
      this.wsRegions.addRegion({
        start: region.start,
        end: region.end,
        color: region.color,
        id: "" + index,
      });

      this.enableRegionClick();
    });
  }
}
export default WaveFormManager;
