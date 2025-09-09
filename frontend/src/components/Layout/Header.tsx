import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import { UserOutlined, BellOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header: React.FC = () => {
  return (
    <AntHeader
      style={{
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <Text strong style={{ fontSize: 18 }}>
          Marketing Analytics Dashboard
        </Text>
      </div>
      
      <Space>
        <Button type="text" icon={<BellOutlined />} />
        <Button type="text" icon={<UserOutlined />}>
          Admin
        </Button>
      </Space>
    </AntHeader>
  );
};

export default Header;