import { Collapse, CollapseProps } from "antd";
import AudioControlManager from "../controls/AudioControlManager";
import { useEffect, useState } from "react";

interface IProps {
  control: AudioControlManager;
}

export default function AnnotationViewer({ control }: IProps) {
  const [items, setItems] = useState<CollapseProps["items"]>([]);
  const [activeIndex, setActiveIndex] = useState<number>();

  useEffect(() => {
    const anns = control.getAnnotations();
    const its = anns.map((a, i) => {
      return {
        key: i,
        label: `Anotation ${i}`,
        children: <p>{JSON.stringify(a)}</p>,
      };
    });
    setItems(its);
    control.on("annotations-updated", (anns) => {
      const its = anns.map((a, i) => {
        return {
          key: i,
          label: `Anotation ${i}`,
          children: <p>{JSON.stringify(a)}</p>,
        };
      });
      console.log(its);

      setItems(its);
    });
    control.on("set-active-annotation", (index) => setActiveIndex(index));
  }, [control]);
  return <Collapse accordion items={items} activeKey={activeIndex} />;
}
