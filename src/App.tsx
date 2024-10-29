// src/App.tsx
import React, { useState } from 'react';
import { Layout, Typography, Upload, Button, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import ImageProcessor from './ImageProcessor';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Dragger } = Upload;
const { Title } = Typography;

function App() {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [processedImages, setProcessedImages] = useState<string[]>([]);

  const props = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    beforeUpload: (file: File) => {
      if (!file.type.startsWith('image/')) {
        message.error(`${file.name} is not an image file.`);
        return Upload.LIST_IGNORE;
      }
      setOriginalImage(file);
      return false; // Prevent automatic upload
    },
    onDrop(e: React.DragEvent<HTMLDivElement>) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Layout className="layout">
      <Header>
        <Title style={{ color: 'white', margin: '16px 0' }}>Image Cropper</Title>
      </Header>
      <Content style={{ padding: '50px' }}>
        <Dragger {...props} style={{ padding: '20px' }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag image file to this area to upload</p>
          <p className="ant-upload-hint">Supports single image file.</p>
        </Dragger>
        {originalImage && (
          <ImageProcessor
            imageFile={originalImage}
            setProcessedImages={setProcessedImages}
          />
        )}
        {processedImages.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <Title level={4}>Processed Images</Title>
            {processedImages.map((src, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <img src={src} alt={`output_${index}`} style={{ maxWidth: '100%' }} />
                <Button
                  type="primary"
                  style={{ margin: '10px 0' }}
                  href={src}
                  download={`output_${index === 0 ? 'left' : 'right'}.png`}
                >
                  Download {index === 0 ? 'Left' : 'Right'} Image
                </Button>
              </div>
            ))}
          </div>
        )}
      </Content>
      <Footer style={{ textAlign: 'center' }}>Image Cropper ©2023</Footer>
    </Layout>
  );
}

export default App;
