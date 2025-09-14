import React, { useState, useEffect, useCallback } from 'react';
import { Input, Tag, Button, Space, Typography, Alert, Spin, Tooltip } from 'antd';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Text } = Typography;

export interface KeywordTag {
  keyword: string;
  added_at: Date;
}

export interface RecentKeyword {
  keyword: string;
  usage_count: number;
  last_used: Date;
}

interface KeywordsInputProps {
  stepId?: string;
  stepType: string;
  initialKeywords?: string[];
  onChange?: (keywords: string[]) => void;
  placeholder?: string;
  maxKeywords?: number;
  showRecent?: boolean;
  disabled?: boolean;
  className?: string;
}

const KeywordsInput: React.FC<KeywordsInputProps> = ({
  stepId,
  stepType,
  initialKeywords = [],
  onChange,
  placeholder = "Enter keyword...",
  maxKeywords = 20,
  showRecent = true,
  disabled = false,
  className
}) => {
  const [keywords, setKeywords] = useState<string[]>(initialKeywords);
  const [inputValue, setInputValue] = useState('');
  const [recentKeywords, setRecentKeywords] = useState<RecentKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch existing keywords for the step
  const fetchStepKeywords = useCallback(async () => {
    if (!stepId) {
      // For new steps, start with initial keywords, no loading
      setKeywords(initialKeywords);
      if (onChange) {
        onChange(initialKeywords);
      }
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.get(`/api/keywords/funnel-steps/${stepId}/keywords`);
      const stepKeywords = response.data.keywords.map((k: KeywordTag) => k.keyword);
      setKeywords(stepKeywords);
      
      if (onChange) {
        onChange(stepKeywords);
      }
    } catch (error) {
      console.error('Error fetching step keywords:', error);
      // For new steps or network errors, use initial keywords without error message
      setKeywords(initialKeywords);
      if (onChange) {
        onChange(initialKeywords);
      }
    } finally {
      setLoading(false);
    }
  }, [stepId, onChange, initialKeywords]);
  
  // Fetch recent keywords
  const fetchRecentKeywords = useCallback(async () => {
    if (!showRecent) return;
    
    try {
      const response = await axios.get('/api/keywords/recent?limit=12');
      setRecentKeywords(response.data.keywords);
    } catch (error) {
      console.error('Error fetching recent keywords:', error);
    }
  }, [showRecent]);
  
  // Load data on mount
  useEffect(() => {
    fetchStepKeywords();
    fetchRecentKeywords();
  }, [fetchStepKeywords, fetchRecentKeywords]);
  
  // Validate keyword input
  const validateKeyword = (keyword: string): string | null => {
    if (!keyword || keyword.length < 2) {
      return 'Keyword must be at least 2 characters long';
    }
    if (keyword.length > 100) {
      return 'Keyword must be less than 100 characters';
    }
    if (!/^[a-zA-Z0-9\s\-]+$/.test(keyword)) {
      return 'Only letters, numbers, spaces, and hyphens are allowed';
    }
    return null;
  };
  
  // Add keyword
  const addKeyword = async (keyword: string) => {
    const cleanKeyword = keyword.trim().toLowerCase();
    
    // Validate
    const validationError = validateKeyword(cleanKeyword);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Check for duplicates
    if (keywords.includes(cleanKeyword)) {
      setError('Keyword already added');
      return;
    }
    
    // Check max keywords limit
    if (keywords.length >= maxKeywords) {
      setError(`Maximum ${maxKeywords} keywords allowed`);
      return;
    }
    
    setError(null);
    
    try {
      setAdding(true);
      
      // Optimistic update
      const newKeywords = [...keywords, cleanKeyword];
      setKeywords(newKeywords);
      
      if (onChange) {
        onChange(newKeywords);
      }
      
      // Save to backend if stepId provided (skip for new steps)
      if (stepId) {
        try {
          await axios.post(`/api/keywords/funnel-steps/${stepId}/keywords`, {
            keyword: cleanKeyword
          });
          
          // Refresh recent keywords
          fetchRecentKeywords();
        } catch (backendError) {
          console.error('Backend save failed, keyword added locally only:', backendError);
          // Continue with local update even if backend fails
        }
      }
      
      setInputValue('');
    } catch (error: any) {
      console.error('Error adding keyword:', error);
      
      // Rollback optimistic update
      setKeywords(keywords);
      if (onChange) {
        onChange(keywords);
      }
      
      if (error.response?.status === 409) {
        setError('Keyword already exists for this step');
      } else {
        setError('Failed to add keyword. Please try again.');
      }
    } finally {
      setAdding(false);
    }
  };
  
  // Remove keyword
  const removeKeyword = async (keywordToRemove: string) => {
    try {
      // Optimistic update
      const newKeywords = keywords.filter(k => k !== keywordToRemove);
      setKeywords(newKeywords);
      
      if (onChange) {
        onChange(newKeywords);
      }
      
      // Remove from backend if stepId provided
      if (stepId) {
        await axios.delete(
          `/api/keywords/funnel-steps/${stepId}/keywords/${encodeURIComponent(keywordToRemove)}`
        );
      }
      
      setError(null);
    } catch (error) {
      console.error('Error removing keyword:', error);
      
      // Rollback optimistic update
      setKeywords([...keywords, keywordToRemove]);
      if (onChange) {
        onChange([...keywords, keywordToRemove]);
      }
      
      setError('Failed to remove keyword. Please try again.');
    }
  };
  
  // Handle input key press
  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addKeyword(inputValue);
    }
  };
  
  // Handle add button click
  const handleAddClick = () => {
    if (inputValue.trim()) {
      addKeyword(inputValue);
    }
  };
  
  // Add recent keyword
  const addRecentKeyword = (keyword: string) => {
    if (!keywords.includes(keyword)) {
      addKeyword(keyword);
    }
  };
  
  // Get available recent keywords (not already added)
  const availableRecentKeywords = recentKeywords.filter(
    rk => !keywords.includes(rk.keyword)
  );
  
  return (
    <div className={`keywords-input ${className || ''}`}>
      {/* Current Keywords */}
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ fontSize: '14px', marginBottom: 8, display: 'block' }}>
          Keywords {keywords.length > 0 && `(${keywords.length}/${maxKeywords})`}
        </Text>
        
        {loading ? (
          <Spin size="small" />
        ) : (
          <div style={{ minHeight: '32px' }}>
            {keywords.length > 0 ? (
              <Space size={[4, 4]} wrap>
                {keywords.map((keyword, index) => (
                  <Tag
                    key={index}
                    closable={!disabled}
                    onClose={() => removeKeyword(keyword)}
                    closeIcon={<CloseOutlined />}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#f0f2ff',
                      borderColor: '#1890ff',
                      color: '#1890ff'
                    }}
                  >
                    {keyword.length > 25 ? (
                      <Tooltip title={keyword}>
                        {keyword.substring(0, 25)}...
                      </Tooltip>
                    ) : (
                      keyword
                    )}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                No keywords added yet
              </Text>
            )}
          </div>
        )}
      </div>
      
      {/* Add Keyword Input */}
      <div style={{ marginBottom: 12 }}>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleInputKeyPress}
            placeholder={placeholder}
            disabled={disabled || keywords.length >= maxKeywords}
            maxLength={100}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClick}
            disabled={disabled || !inputValue.trim() || adding || keywords.length >= maxKeywords}
            loading={adding}
          >
            Add
          </Button>
        </Space.Compact>
      </div>
      
      {/* Error Message */}
      {error && (
        <Alert
          message={error}
          type="error"
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 12 }}
        />
      )}
      
      {/* Recent Keywords */}
      {showRecent && availableRecentKeywords.length > 0 && (
        <div>
          <Text type="secondary" style={{ fontSize: '12px', marginBottom: 6, display: 'block' }}>
            Recent keywords:
          </Text>
          <Space size={[4, 4]} wrap>
            {availableRecentKeywords.slice(0, 8).map((recent, index) => (
              <Button
                key={index}
                size="small"
                type="dashed"
                onClick={() => addRecentKeyword(recent.keyword)}
                disabled={disabled || keywords.length >= maxKeywords}
                style={{
                  fontSize: '11px',
                  height: '24px',
                  padding: '0 8px'
                }}
              >
                + {recent.keyword.length > 20 ? `${recent.keyword.substring(0, 20)}...` : recent.keyword}
              </Button>
            ))}
          </Space>
        </div>
      )}
      
      {/* Keywords limit info */}
      {keywords.length >= maxKeywords * 0.8 && (
        <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: 8 }}>
          {maxKeywords - keywords.length} keyword{maxKeywords - keywords.length !== 1 ? 's' : ''} remaining
        </Text>
      )}
    </div>
  );
};

export default KeywordsInput;