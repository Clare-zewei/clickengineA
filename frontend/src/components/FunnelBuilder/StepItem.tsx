import React from 'react';
import { Card, Button, Space, Typography, Tag, Badge } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FunnelStep } from './FunnelStepsList';

const { Text } = Typography;

interface StepItemProps {
  step: FunnelStep;
  index: number;
  onEdit: (step: FunnelStep) => void;
  onDelete: (stepId: string) => void;
}

const StepItem: React.FC<StepItemProps> = ({ step, index, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStepColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      green: '#52c41a',
      blue: '#1890ff',
      orange: '#fa8c16',
      red: '#f5222d',
      purple: '#722ed1',
      cyan: '#13c2c2',
      gold: '#faad14',
      magenta: '#eb2f96',
      volcano: '#fa541c',
      default: '#d9d9d9'
    };
    return colorMap[color] || '#d9d9d9';
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        style={{ 
          marginBottom: 0,
          borderLeft: `4px solid ${getStepColor(step.color)}`,
          cursor: 'move'
        }}
        bodyStyle={{ padding: '12px 16px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
            {/* Drag Handle */}
            <div {...listeners} style={{ cursor: 'grab' }}>
              <MenuOutlined style={{ color: '#bfbfbf', fontSize: 16 }} />
            </div>

            {/* Step Number */}
            <Badge 
              count={index + 1} 
              style={{ 
                backgroundColor: getStepColor(step.color),
                fontSize: 14,
                fontWeight: 'bold'
              }}
            />

            {/* Step Icon and Name */}
            <Space size={8}>
              <span style={{ fontSize: 24 }}>{step.icon}</span>
              <Text strong style={{ fontSize: 16 }}>
                {step.name}
              </Text>
            </Space>

            {/* Step Type Tag */}
            <Tag color={step.color}>{step.type}</Tag>

            {/* Required Badge */}
            {step.required && (
              <Tag color="red">Required</Tag>
            )}

            {/* GA4 Event */}
            {step.ga4Event && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                GA4: <code>{step.ga4Event}</code>
              </Text>
            )}

            {/* Configuration Summary */}
            {step.config && (
              <Space size={4}>
                {step.config.utm?.campaign && (
                  <Tag color="blue" style={{ fontSize: 11 }}>
                    Campaign: {step.config.utm.campaign}
                  </Tag>
                )}
                {step.config.keywords && step.config.keywords.length > 0 && (
                  <Tag color="purple" style={{ fontSize: 11 }}>
                    {step.config.keywords.length} keywords
                  </Tag>
                )}
                {step.config.channel && (
                  <Tag color="green" style={{ fontSize: 11 }}>
                    {step.config.channel}
                  </Tag>
                )}
              </Space>
            )}
          </div>

          {/* Action Buttons */}
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(step)}
              style={{ color: '#1890ff' }}
            >
              Edit
            </Button>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(step.id)}
            >
              Delete
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default StepItem;