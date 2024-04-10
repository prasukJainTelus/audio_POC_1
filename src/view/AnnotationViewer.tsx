import { Collapse, CollapseProps } from "antd";
import AudioControlManager from "../workspace/AudioWorkspace";
import { useEffect, useState } from "react";

interface IProps {
  control: AudioControlManager;
}

export default function AnnotationViewer({ control }: IProps) {
  const [items, setItems] = useState<CollapseProps["items"]>([]);
  const [activeKey, setActiveKey] = useState<string>();

  function onAnnotationSelect(e: string | Array<string>) {
    if (Array.isArray(e)) {
      if (e.length) control.setActiveAnnotationName(e[0]);
      else control.setActiveAnnotation(undefined);
    } else control.setActiveAnnotationName(e);
  }
  useEffect(() => {
    const anns = control.getAnnotations();
    const its = anns.map((a) => {
      return {
        key: a.name,
        label: a.name,
        children: <p>{JSON.stringify(a)}</p>,
      };
    });
    setItems(its);
    control.on("annotations-updated", (anns) => {
      const its = anns.map((a) => {
        return {
          key: a.name,
          label: a.name,
          children: <p>{JSON.stringify(a)}</p>,
        };
      });
      setItems(its);
    });
    control.on("set-active-annotation", (annotation) =>
      setActiveKey(annotation?.name)
    );
  }, [control]);
  return (
    <Collapse
      accordion
      items={items}
      activeKey={activeKey}
      onChange={(e) => onAnnotationSelect(e)}
    />
  );
}
