import {
  CaretRightOutlined,
  FastBackwardOutlined,
  FastForwardOutlined,
  PauseOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Button, Col, Layout, Row } from "antd";
import AudioControlManager from "../workspace/AudioWorkspace";
import { useEffect, useState } from "react";

interface IProps {
  control: AudioControlManager;
}

export default function AudioPlayer({ control }: IProps) {
  const [zoom, setZoom] = useState(100);
  const [speed, setSpeed] = useState(1);
  useEffect(() => {
    control.initializeAudioPlayer();
  }, [control]);

  function setWaveZoom(zoom: number) {
    setZoom(zoom);
    control.setWaveZoom(zoom);
  }

  function setPlayBackSpeed(speed: number) {
    setSpeed(speed);
    control.setPlayBackSpeed(speed);
  }
  return (
    <Layout style={{ padding: "50px", height: "100%" }}>
      <div style={{ overflow: "auto", width: "100%" }}>
        <div id="waveform">
          <div id="waveform-timeline"></div>
        </div>
      </div>
      <Row>
        <Col span={1}>
          {control.isPlaying ? (
            <Button
              type="primary"
              shape="circle"
              icon={<PauseOutlined />}
              onClick={() => control.togglePlay()}
            />
          ) : (
            <Button
              type="primary"
              shape="circle"
              icon={<CaretRightOutlined />}
              onClick={() => control.togglePlay()}
            />
          )}
        </Col>
        <Col span={5}>
          <ZoomOutOutlined style={{ color: "black" }} />
          <input
            type="range"
            min={1}
            max={800}
            step={20}
            value={zoom}
            onChange={(e) => setWaveZoom(e.target.valueAsNumber)}
          />
          <ZoomInOutlined style={{ color: "black" }} />
        </Col>

        <Col span={5}>
          <FastBackwardOutlined style={{ color: "black" }} />
          <input
            type="range"
            min={0.1}
            max={2}
            step={0.1}
            value={speed}
            onChange={(e) => setPlayBackSpeed(e.target.valueAsNumber)}
          />
          <FastForwardOutlined style={{ color: "black" }} />
        </Col>
      </Row>
      <div className="row justify-content-center">
        <div className="col-1"></div>
        <div className="col-2"></div>
        <div className="col-1"></div>
      </div>
    </Layout>
  );
}
