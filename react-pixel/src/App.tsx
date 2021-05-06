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
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import PostMessager from './post-messager';

import './App.css';
const Messager = new PostMessager(window.parent, true);

function App() {
  const [size, setSize] = useState(100);
  const [loading, setLoading] = useState(false);
  const [modeValue, setModeValue] = useState('normal');
  const [freeOrShowValue, setFreeOrShowValue] = useState<CheckboxValueType[]>([
    'show',
  ]);
  const [imgInfo, setImgInfo] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const onInnputChange = (value: number) => {
    setSize(value);
    Messager.send('img-opacity', {
      opacity: value,
    });
  };
  useEffect(() => {
    Messager.listen('img-position', (data) => {
      const position = {
        left: parseInt(data.left),
        top: parseInt(data.top),
      };
      setImgInfo((imgInfo) => ({ ...imgInfo, ...position }));
    });
  }, []);

  const [url, setUrl] = useState('');
  const props: any = {
    name: 'file',
    multiple: false,
    beforeUpload(file: Blob) {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        const url: string = this.result as string;
        var imgNode = document.createElement('img');
        imgNode.src = url;
        imgNode.style['cursor'] = 'all-scroll';
        imgNode.style['position'] = 'fixed';
        imgNode.style['top'] = '0px';
        imgNode.style['left'] = '0px';
        imgNode.style['display'] = 'block';
        imgNode.style['opacity'] = '50%';
        imgNode.style['zIndex'] = '1000';
        imgNode.id = 'eruda-pixel-upload-img';

        let shadowRoot: ShadowRoot;
        const body = window.parent.document.body;
        // 删除原有的 img 容器
        window.parent.document
          .getElementById('eruda-pixel-upload-img-container')
          ?.remove();
        // 创建 img 容器
        let imgContainer = document.createElement('div');
        imgContainer.id = 'eruda-pixel-upload-img-container';
        body.appendChild(imgContainer);
        imgContainer.style.all = 'initial';

        if (imgContainer.attachShadow) {
          // shadow dom 避免样式污染
          shadowRoot = imgContainer.attachShadow({ mode: 'open' });
          shadowRoot.appendChild(imgNode);
        } else {
          // shadow dom 降级
          imgContainer.appendChild(imgNode);
        }
        imgNode.onload = function () {
          setLoading(false);
          setImgInfo({
            width: (this as any).width,
            height: (this as any).height,
            left: 0,
            top: 0,
          });
          setUrl(url);
          setSize(50);
          setModeValue('normal');
          setFreeOrShowValue(['show']);
          Messager.send('img-created', 'created');
        };
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
    { label: '排除', value: 'exclusion' },
    { label: '强光', value: 'hard-light' },
    { label: '柔光', value: 'soft-light' },
  ];

  function onFreeOrShowChange(checkedValues: CheckboxValueType[]) {
    setFreeOrShowValue(checkedValues);
    Messager.send('img-freeze', {
      freeze: checkedValues.includes('freeze'),
    });
    Messager.send('img-show', {
      show: checkedValues.includes('show'),
    });
  }
  function onModeChange(value: string) {
    setModeValue(value);
    Messager.send('img-mode', {
      mode: value,
    });
  }
  function onWidth(value: number) {
    const info = {
      ...imgInfo,
      width: value,
    };
    setImgInfo(info);
    Messager.send('img-info', {
      info: info,
    });
  }
  function onLeft(value: number) {
    const info = {
      ...imgInfo,
      left: value,
    };
    setImgInfo(info);
    Messager.send('img-info', {
      info: info,
    });
  }
  function onTop(value: number) {
    const info = {
      ...imgInfo,
      top: value,
    };
    setImgInfo(info);
    Messager.send('img-info', {
      info: info,
    });
  }
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>请先上传</div>
    </div>
  );
  return (
    <Space direction="vertical" className="pixel-container">
      <Card
        title={
          <Space>
            <div className="mr100">eruda-pixe </div>
            <Checkbox.Group
              options={plainOptions}
              disabled={!url}
              onChange={onFreeOrShowChange}
              value={freeOrShowValue}
            />
          </Space>
        }
      >
        <Row align="middle" className="mb16">
          <Col span={4}>模式：</Col>
          <Col span={20}>
            <Select
              style={{ width: 160 }}
              onChange={onModeChange}
              disabled={!url}
              value={modeValue}
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
              parser={(value) => parseInt((value || '').replace('%', ''))}
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
              min={Number.MIN_SAFE_INTEGER}
              max={Number.MAX_SAFE_INTEGER}
              formatter={(value) => `${value}px`}
              parser={(value) => parseInt((value || '').replace('px', ''))}
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
              min={Number.MIN_SAFE_INTEGER}
              max={Number.MAX_SAFE_INTEGER}
              disabled={!url}
              formatter={(value) => `${value}px`}
              parser={(value) => parseInt((value || '').replace('px', ''))}
              onChange={onLeft}
            />
          </Col>
          <Col span={4}>Y轴：</Col>
          <Col span={8}>
            <InputNumber
              value={imgInfo.top}
              min={Number.MIN_SAFE_INTEGER}
              max={Number.MAX_SAFE_INTEGER}
              disabled={!url}
              formatter={(value) => `${value}px`}
              parser={(value) => parseInt((value || '').replace('px', ''))}
              onChange={onTop}
            />
          </Col>
        </Row>
      </Card>
      <Card>
        <Upload {...props} listType="picture-card" maxCount={1}>
          {uploadButton}
        </Upload>
      </Card>
    </Space>
  );
}

export default App;
