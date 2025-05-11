import React from 'react';
import { Box, Typography, Paper, Avatar, Tooltip, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { type Message, UserRole } from '../../../types';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessagePaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isCurrentUser',
})<{ isCurrentUser: boolean }>(({ theme, isCurrentUser }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.spacing(2),
  maxWidth: '80%',
  backgroundColor: isCurrentUser
    ? theme.palette.primary.main
    : theme.palette.background.paper,
  color: isCurrentUser
    ? theme.palette.primary.contrastText
    : theme.palette.text.primary,
  boxShadow: theme.shadows[1],
}));

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
}) => {
  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM d, h:mm a');
  };

  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) {
      return null;
    }

    return (
      <Box sx={{ mt: 1 }}>
        {message.attachments.map((attachment) => (
          <Box
            key={attachment.id}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1,
              my: 0.5,
              borderRadius: 1,
              bgcolor: 'background.default',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Box sx={{ ml: 1 }}>
              <Link
                href={attachment.url}
                target='_blank'
                rel='noopener noreferrer'
              >
                {attachment.filename}
              </Link>
              <Typography
                variant='caption'
                display='block'
                color='text.secondary'
              >
                {(attachment.size / 1024).toFixed(2)} KB
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: isCurrentUser ? 'row-reverse' : 'row',
        mb: 2,
      }}
    >
      <Avatar
        src={message.sender.avatar}
        alt={message.sender.name}
        sx={{
          bgcolor:
            message.sender.role === UserRole.AGENT
              ? 'secondary.main'
              : 'primary.main',
          width: 38,
          height: 38,
          mx: 1,
        }}
      >
        {message.sender.name.charAt(0)}
      </Avatar>
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 0.5,
            flexDirection: isCurrentUser ? 'row-reverse' : 'row',
          }}
        >
          <Typography
            variant='subtitle2'
            fontWeight='bold'
            sx={{ mr: isCurrentUser ? 0 : 1, ml: isCurrentUser ? 1 : 0 }}
          >
            {message.sender.name}
          </Typography>
          <Tooltip
            title={format(
              new Date(message.createdAt),
              'MMMM d, yyyy h:mm:ss a'
            )}
          >
            <Typography variant='caption' color='text.secondary'>
              {formatTimestamp(message.createdAt)}
            </Typography>
          </Tooltip>
        </Box>
        <MessagePaper isCurrentUser={isCurrentUser}>
          <Typography variant='body1'>{message.content}</Typography>
          {renderAttachments()}
        </MessagePaper>
      </Box>
    </Box>
  );
};

export default MessageBubble;
