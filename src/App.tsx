import { Layout } from "antd";
import "./App.css";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import { contentStyle, layoutStyle, siderStyle } from "./App.style";
import { useEffect, useState } from "react";
import AudioControlManager from "./controls/AudioControlManager";
import AudioPlayer from "./view/AudioPlayer";
import AnnotationTool from "./view/AnnotationTool";
import AnnotationViewer from "./view/AnnotationViewer";

function App() {
  const [control, setControl] = useState<AudioControlManager | undefined>(
    undefined
  );

  useEffect(() => {
    setControl(new AudioControlManager());
  }, []);

  return (
    <Layout style={layoutStyle}>
      {!control ? (
        <h1>Please Reload</h1>
      ) : (
        <Layout>
          <AnnotationTool control={control} />
          <Content style={contentStyle}>
            <AudioPlayer control={control} />
          </Content>
        </Layout>
      )}
      <Sider width="25%" style={siderStyle}>
        {control && <AnnotationViewer control={control} />}
      </Sider>
    </Layout>
  );
}

export default App;
