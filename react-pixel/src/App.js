import { useState, useEffect } from 'react';

import {
  Space,
  Card,
  Checkbox,
  Select,
  Slider,
  InputNumber,
  Upload,
  Col,
  Row,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import PostMessager from './post-messager';

import './App.css';
const { Dragger } = Upload;
const Messager = new PostMessager(window.parent, true);

function App() {
  const [size, setSize] = useState(100);
  const [imgInfo, setImgInfo] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const onInnputChange = (value) => {
    setSize(value);
    Messager.send('img-opacity', {
      opacity: value,
    });
  };
  useEffect(() => {
    Messager.listen('img-position', (data) => {
      const p = {
        ...imgInfo,
        left: parseInt(data.left),
        top: parseInt(data.top),
      };
      setImgInfo(p);
    });
  }, [imgInfo]);

  const [url, setUrl] = useState('');
  const props = {
    name: 'file',
    multiple: true,
    beforeUpload(file) {
      const url = URL.createObjectURL(file);
      setUrl(url);
      var imgNode = document.createElement('img');
      imgNode.src = url;
      imgNode.style['cursor'] = 'all-scroll';
      imgNode.style['position'] = 'fixed';
      imgNode.style['top'] = '0px';
      imgNode.style['left'] = '0px';
      imgNode.style['display'] = 'block';
      imgNode.id = 'eruda-pixel';
      window.parent.document.body.appendChild(imgNode);
      imgNode.onload = function () {
        setImgInfo({
          width: this.width,
          height: this.height,
          left: 0,
          top: 0,
        });
        Messager.send('img-created', 'created');
      };

      return false;
    },
  };
  const plainOptions = [
    { label: '冻结', value: 'freeze' },
    { label: '显示', value: 'show' },
  ];
  const modeOptions = [
    { label: '正常', value: 'normal' },
    { label: '正片叠底', value: 'multiply' },
    { label: '滤色', value: 'screen' },
    { label: '叠加', value: 'overlay' },
    { label: '变暗', value: 'darken' },
    { label: '变亮', value: 'lighten' },
    { label: '差值', value: 'difference' },
  ];

  function onRadioChange(checkedValues) {
    Messager.send('img-freeze', {
      freeze: checkedValues.includes('freeze'),
    });
    Messager.send('img-show', {
      show: checkedValues.includes('show'),
    });
  }
  function onTypeChange(value) {
    Messager.send('img-mode', {
      mode: value,
    });
  }
  function onWidth(value) {
    const info = {
      ...imgInfo,
      width: value,
    };
    setImgInfo(info);
    Messager.send('img-info', {
      info: info,
    });
  }
  function onLeft(value) {
    const info = {
      ...imgInfo,
      left: value,
    };
    setImgInfo(info);
    Messager.send('img-info', {
      info: info,
    });
  }
  function onTop(value) {
    const info = {
      ...imgInfo,
      top: value,
    };
    setImgInfo(info);
    Messager.send('img-info', {
      info: info,
    });
  }
  return (
    <Space direction="vertical" size={0}>
      <Card
        title={
          <Space>
            <div className="mr-20">eruda-pixe</div>
            <Checkbox.Group
              options={plainOptions}
              disabled={!url}
              onChange={onRadioChange}
              defaultValue={['show']}
            />
          </Space>
        }
      >
        <Row align="middle" className="mb16">
          <Col span={4}>模式：</Col>
          <Col span={20}>
            <Select
              defaultValue="normal"
              style={{ width: 160 }}
              onChange={onTypeChange}
              disabled={!url}
            >
              {modeOptions.map((item) => {
                return (
                  <Select.Option value={item.value} key={item.value}>
                    {item.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Col>
        </Row>

        <Row align="middle">
          <Col span={4}>透明度:</Col>
          <Col span={13}>
            <Slider
              disabled={!url}
              min={1}
              max={100}
              onChange={onInnputChange}
              value={typeof size === 'number' ? size : 0}
            />
          </Col>
          <Col span={4} offset={1}>
            <InputNumber
              disabled={!url}
              min={1}
              max={100}
              value={size}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace('%', '')}
              onChange={onInnputChange}
            />
          </Col>
        </Row>
      </Card>
      <Card
        title={
          <Space>
            <div className="mr-20">位置/大小</div>
          </Space>
        }
      >
        <Row align="middle" className="mb16">
          <Col span={4}>宽度：</Col>
          <Col span={8}>
            <InputNumber
              disabled={!url}
              value={imgInfo.width}
              min
              max
              formatter={(value) => `${value}px`}
              parser={(value) => value.replace('px', '')}
              onChange={onWidth}
            />
          </Col>
          <Col span={12}>高度随宽度等比例缩放</Col>
        </Row>
        <Row align="middle">
          <Col span={4}>X轴：</Col>
          <Col span={8}>
            <InputNumber
              value={imgInfo.left}
              min
              disabled={!url}
              max
              formatter={(value) => `${value}px`}
              parser={(value) => value.replace('px', '')}
              onChange={onLeft}
            />
          </Col>
          <Col span={4}>Y轴：</Col>
          <Col span={8}>
            <InputNumber
              value={imgInfo.top}
              min
              max
              disabled={!url}
              formatter={(value) => `${value}px`}
              parser={(value) => value.replace('px', '')}
              onChange={onTop}
            />
          </Col>
        </Row>
      </Card>
      <Card>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload 拖拽或者点击上传图片
          </p>
          <p className="ant-upload-hint">上传图片后，即可操作上面的配置。</p>
        </Dragger>
      </Card>
    </Space>
  );
}

export default App;
