import { InboxOutlined } from "@ant-design/icons";
import { Layout, UploadProps, message } from "antd";
import Upload, { RcFile } from "antd/es/upload";

const { Dragger } = Upload;

interface IProps {
  onAudioFileSet: (file: File) => void;
}

export default function AudioUploader({ onAudioFileSet }: IProps) {
  const props: UploadProps = {
    name: "file",
    multiple: false,
    fileList: [],
    action: "",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file: RcFile) => {
      if (!file.type.includes("audio")) {
        message.error("Please select a valid audio file");
        return Upload.LIST_IGNORE;
      }
      onAudioFileSet(file as File);
      return false;
    },
  };
  return (
    <Layout style={{ padding: "50px", height: "100%" }}>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
    </Layout>
  );
}
