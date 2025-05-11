import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Paper,
  Typography,
  Chip,
  LinearProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading = false,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        borderRadius: '16px',
      }}
    >
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      {attachments.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant='subtitle2' sx={{ mb: 1 }}>
            Attachments
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {attachments.map((file, index) => (
              <Chip
                key={index}
                label={file.name}
                onDelete={() => handleRemoveFile(index)}
                deleteIcon={<CloseIcon />}
                variant='outlined'
              />
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <IconButton
          onClick={handleAttachClick}
          disabled={disabled || isLoading}
          sx={{ mb: 1, mr: 1 }}
          color='primary'
        >
          <AttachFileIcon />
        </IconButton>

        <input
          type='file'
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
        />

        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='Type your message here...'
          variant='outlined'
          disabled={disabled || isLoading}
          InputProps={{
            sx: { borderRadius: '24px' },
          }}
        />

        <Button
          onClick={handleSend}
          disabled={
            disabled ||
            isLoading ||
            (message.trim() === '' && attachments.length === 0)
          }
          sx={{
            ml: 1,
            borderRadius: '50%',
            minWidth: 0,
            width: 48,
            height: 48,
          }}
          variant='contained'
          color='primary'
        >
          <SendIcon />
        </Button>
      </Box>
    </Paper>
  );
};

export default MessageInput;
