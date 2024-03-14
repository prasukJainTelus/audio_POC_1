import { Header } from "antd/es/layout/layout";
import AudioControlManager from "../controls/AudioControlManager";
import { VerticalAlignMiddleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Button, Row } from "antd";

interface IProps {
  control: AudioControlManager;
}

export default function AnnotationTool({ control }: IProps) {
  const [isRegionEnabled, setIsRegionEnabled] = useState(false);

  useEffect(() => {
    control.on("allow-region", (region) => {
      setIsRegionEnabled(region);
    });
  }, [control]);

  function toggleRegion() {
    setIsRegionEnabled(!isRegionEnabled);
    if (isRegionEnabled) {
      control.disableRegion();
    } else {
      control.enableRegion();
    }
  }
  return (
    <Header style={{ padding: "10px" }}>
      <Row>
        <Button type="primary" onClick={() => toggleRegion()}>
          <VerticalAlignMiddleOutlined style={{ transform: "rotate(90deg)" }} />
        </Button>
      </Row>
    </Header>
  );
}
