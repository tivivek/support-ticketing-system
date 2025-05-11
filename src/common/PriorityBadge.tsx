import React from 'react';
import { Chip, type ChipProps } from '@mui/material';
import { TicketPriority } from '../types';
import FlagIcon from '@mui/icons-material/Flag';

interface PriorityBadgeProps {
  priority: TicketPriority;
  size?: 'small' | 'medium';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'medium',
}) => {
  const getPriorityProps = (): { color: ChipProps['color']; label: string } => {
    switch (priority) {
      case TicketPriority.LOW:
        return { color: 'default', label: 'Low' };
      case TicketPriority.MEDIUM:
        return { color: 'info', label: 'Medium' };
      case TicketPriority.HIGH:
        return { color: 'warning', label: 'High' };
      case TicketPriority.CRITICAL:
        return { color: 'error', label: 'Critical' };
      default:
        return { color: 'default', label: priority };
    }
  };

  const { color, label } = getPriorityProps();

  return (
    <Chip
      icon={<FlagIcon />}
      label={label}
      color={color}
      size={size}
      variant='outlined'
      sx={{
        fontWeight: 500,
      }}
    />
  );
};

export default PriorityBadge;
