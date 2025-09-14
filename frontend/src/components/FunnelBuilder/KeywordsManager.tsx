import React, { useState, useRef, useEffect } from 'react';
import {
  Input,
  Button,
  Tag,
  Space,
  message,
  Popconfirm,
  Tooltip,
  Typography,
  Empty
} from 'antd';
import {
  PlusOutlined,
  ClearOutlined,
  EditOutlined,
  DeleteOutlined,
  EnterOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { Text } = Typography;

export interface Keyword {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

interface KeywordsManagerProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
  maxKeywords?: number;
  placeholder?: string;
  disabled?: boolean;
}

const KeywordsManager: React.FC<KeywordsManagerProps> = ({
  keywords = [],
  onChange,
  maxKeywords = 20,
  placeholder = "Enter keyword",
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [keywordItems, setKeywordItems] = useState<Keyword[]>([]);
  const inputRef = useRef<any>(null);
  const editInputRef = useRef<any>(null);

  // Initialize keyword items from props
  useEffect(() => {
    const items = keywords.map((text, index) => ({
      id: `kw_${Date.now()}_${index}`,
      text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
    setKeywordItems(items);
  }, []);

  // Validation function
  const validateKeyword = (text: string): { valid: boolean; error?: string } => {
    const trimmed = text.trim();
    
    if (trimmed.length < 2) {
      return { valid: false, error: 'Keyword must be at least 2 characters' };
    }
    
    if (trimmed.length > 50) {
      return { valid: false, error: 'Keyword must be less than 50 characters' };
    }
    
    // Check for special characters (allow only letters, numbers, spaces, hyphens, and underscores)
    const validPattern = /^[a-zA-Z0-9\s\-_]+$/;
    if (!validPattern.test(trimmed)) {
      return { valid: false, error: 'Only letters, numbers, spaces, hyphens, and underscores allowed' };
    }
    
    // Check for duplicates
    const isDuplicate = keywordItems.some(
      item => item.text.toLowerCase() === trimmed.toLowerCase() && item.id !== editingId
    );
    if (isDuplicate) {
      return { valid: false, error: 'Keyword already exists' };
    }
    
    return { valid: true };
  };

  // Normalize keyword text
  const normalizeKeyword = (text: string): string => {
    return text.trim().toLowerCase();
  };

  // Add keyword
  const handleAddKeyword = () => {
    if (!inputValue.trim()) {
      message.warning('Please enter a keyword');
      return;
    }

    if (keywordItems.length >= maxKeywords) {
      message.error(`Maximum ${maxKeywords} keywords allowed`);
      return;
    }

    const validation = validateKeyword(inputValue);
    if (!validation.valid) {
      message.error(validation.error);
      return;
    }

    const newKeyword: Keyword = {
      id: `kw_${Date.now()}`,
      text: inputValue.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedItems = [...keywordItems, newKeyword];
    setKeywordItems(updatedItems);
    onChange(updatedItems.map(item => item.text));
    setInputValue('');
    message.success('Keyword added successfully');
    
    // Focus back to input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  // Edit keyword
  const handleStartEdit = (keyword: Keyword) => {
    setEditingId(keyword.id);
    setEditValue(keyword.text);
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 100);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      message.warning('Keyword cannot be empty');
      return;
    }

    const validation = validateKeyword(editValue);
    if (!validation.valid) {
      message.error(validation.error);
      return;
    }

    const updatedItems = keywordItems.map(item => 
      item.id === editingId 
        ? { ...item, text: editValue.trim(), updatedAt: new Date().toISOString() }
        : item
    );
    
    setKeywordItems(updatedItems);
    onChange(updatedItems.map(item => item.text));
    setEditingId(null);
    setEditValue('');
    message.success('Keyword updated successfully');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // Delete keyword
  const handleDeleteKeyword = (id: string) => {
    const updatedItems = keywordItems.filter(item => item.id !== id);
    setKeywordItems(updatedItems);
    onChange(updatedItems.map(item => item.text));
    message.success('Keyword removed successfully');
  };

  // Clear all keywords
  const handleClearAll = () => {
    setKeywordItems([]);
    onChange([]);
    message.success('All keywords cleared');
  };

  // Handle input key press
  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  // Handle edit input key press
  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Input Section */}
      <Space.Compact style={{ width: '100%', marginBottom: 12 }}>
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleInputKeyPress}
          disabled={disabled || keywordItems.length >= maxKeywords}
          style={{ flex: 1 }}
          suffix={
            <Text type="secondary" style={{ fontSize: 11 }}>
              {keywordItems.length}/{maxKeywords}
            </Text>
          }
        />
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddKeyword}
          disabled={disabled || keywordItems.length >= maxKeywords}
        >
          Add
        </Button>
      </Space.Compact>

      {/* Keywords Display */}
      <div 
        style={{ 
          minHeight: 80,
          padding: 12,
          border: '1px solid #f0f0f0',
          borderRadius: 6,
          backgroundColor: '#fafafa',
          marginBottom: 12
        }}
      >
        {keywordItems.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text type="secondary">No keywords added</Text>
            }
            style={{ margin: 0 }}
          />
        ) : (
          <Space size={[8, 8]} wrap>
            {keywordItems.map(keyword => (
              <div key={keyword.id}>
                {editingId === keyword.id ? (
                  // Edit Mode
                  <Space.Compact>
                    <Input
                      ref={editInputRef}
                      size="small"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={handleEditKeyPress}
                      onBlur={handleSaveEdit}
                      style={{ 
                        width: 150,
                        border: '2px solid #FF9800',
                        backgroundColor: '#FFF3E0'
                      }}
                    />
                    <Button
                      size="small"
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={handleSaveEdit}
                      style={{ color: '#52c41a' }}
                    />
                    <Button
                      size="small"
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={handleCancelEdit}
                      style={{ color: '#ff4d4f' }}
                    />
                  </Space.Compact>
                ) : (
                  // Display Mode
                  <Tag
                    style={{
                      backgroundColor: '#E3F2FD',
                      color: '#1565C0',
                      border: '1px solid #90CAF9',
                      padding: '4px 8px',
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <span onClick={() => !disabled && handleStartEdit(keyword)}>
                      {keyword.text}
                    </span>
                    <Tooltip title="Edit keyword">
                      <EditOutlined 
                        style={{ 
                          fontSize: 12, 
                          color: '#90A4AE',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          !disabled && handleStartEdit(keyword);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Delete keyword">
                      <CloseOutlined
                        style={{ 
                          fontSize: 12, 
                          color: '#F44336',
                          cursor: 'pointer',
                          marginLeft: 2
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          !disabled && handleDeleteKeyword(keyword.id);
                        }}
                      />
                    </Tooltip>
                  </Tag>
                )}
              </div>
            ))}
          </Space>
        )}
      </div>

      {/* Actions */}
      {keywordItems.length > 0 && (
        <Space>
          <Popconfirm
            title="Clear all keywords"
            description="Are you sure you want to remove all keywords?"
            onConfirm={handleClearAll}
            okText="Yes"
            cancelText="No"
            disabled={disabled}
          >
            <Button 
              size="small"
              icon={<ClearOutlined />}
              disabled={disabled}
            >
              Clear All ({keywordItems.length})
            </Button>
          </Popconfirm>
          
          <Text type="secondary" style={{ fontSize: 12 }}>
            <EnterOutlined /> Press Enter to add • Click to edit • × to delete
          </Text>
        </Space>
      )}
    </div>
  );
};

export default KeywordsManager;