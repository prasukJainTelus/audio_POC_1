/* eslint-disable @typescript-eslint/ban-ts-comment */
import WaveSurfer from "wavesurfer.js";
import Regions from "wavesurfer.js/dist/plugins/regions.esm.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import Minimap from "wavesurfer.js/dist/plugins/minimap.esm.js";

import {
  IAnnotation,
  IRegion,
  IRegionAnnotation,
  IUpdateRegion,
} from "../../interfaces/Interface";
import EventEmitter from "wavesurfer.js/dist/event-emitter.js";

export type WaveFormEvents = {
  "plugin-update": [state: boolean];
  "on-region-select": [regionName: string];
  "on-toggle-play": [play: boolean];
  "on-region-created": [region: IRegion];
  "on-region-updated": [region: IUpdateRegion];
};

class WaveFormManager extends EventEmitter<WaveFormEvents> {
  private wavesurfer: WaveSurfer | undefined = undefined;

  wsRegions: Regions;
  disableDragSelection?: () => void;

  constructor() {
    super();
    const element = document.getElementById("waveform");
    if (element)
      element.innerHTML = `
        <div id="waveform-timeline"></div>
    `;
    if (!this.wavesurfer)
      this.wavesurfer = WaveSurfer.create({
        container: "#waveform",
        barWidth: 2,
        barHeight: 1,
        mediaControls: false,
        minPxPerSec: 400,
        plugins: [
          Minimap.create({
            height: 20,
            waveColor: "red",
            progressColor: "red",
          }),
          TimelinePlugin.create({
            height: 20,
            insertPosition: "beforebegin",
            timeInterval: 0.1,
            primaryLabelInterval: 1,
            secondaryLabelInterval: 0.1,
            style: {
              fontSize: "20px",
              color: "red",
            },
          }),
        ],
      });
    this.initiateWavesurfer();

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
      this.emit("on-region-select", region.id);
      this.wsRegions.once("region-out", () =>
        this.emit("on-toggle-play", false)
      );
      this.enableUpdateAction();
      this.wavesurfer?.setTime(region.start);
      this.wavesurfer?.play();
    });
  }

  public disableRegionActions() {
    if (!this.wavesurfer) return;
    this.wavesurfer.toggleInteraction(false);
    this.wsRegions.on("region-created", () => {});
    this.wsRegions.on("region-clicked", () => {});
    this.wsRegions.on("region-updated", () => {});
  }

  enableUpdateAction() {
    this.wsRegions.on("region-updated", (region) => {
      region.remove();
      this.emit("on-region-updated", {
        start: region.start,
        end: region.end,
        name: region.id,
      });
    });
  }
  enableCreateAction() {
    this.wsRegions.unAll();

    this.wsRegions.once("region-created", (region) => {
      region.remove();
      this.wsRegions.unAll();
      this.disableRegion();

      this.emit("on-region-created", {
        start: region.start,
        end: region.end,
      });
    });
  }
  public updateRegions(regions: IRegionAnnotation[]) {
    if (!this.wavesurfer) return;
    this.wsRegions.clearRegions();
    this.disableRegionActions();
    regions.forEach((region) => {
      this.wsRegions.addRegion({
        start: region.start,
        end: region.end,
        color: region.color,
        id: region.name,
      });

      this.enableRegionClick();
    });
  }

  public setActiveAnnotation(annotation: IAnnotation | undefined) {
    if (!this.wavesurfer) return;
    this.wsRegions.getRegions().forEach((region) => {
      region.remove();
      this.wsRegions.addRegion({
        ...region,
        color:
          region.id === annotation?.name
            ? "rgba(0,255, 0, 0.5)"
            : "rgba(255, 0, 0, 0.1)",
      });
    });
  }
}
export default WaveFormManager;
