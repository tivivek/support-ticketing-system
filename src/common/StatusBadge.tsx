import React from 'react';
import { Chip, type ChipProps } from '@mui/material';
import { TicketStatus } from '../types/index';

interface StatusBadgeProps {
  status: TicketStatus;
  size?: 'small' | 'medium';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const getStatusProps = (): { color: ChipProps['color']; label: string } => {
    switch (status) {
      case TicketStatus.OPEN:
        return { color: 'primary', label: 'Open' };
      case TicketStatus.IN_PROGRESS:
        return { color: 'info', label: 'In Progress' };
      case TicketStatus.PENDING:
        return { color: 'warning', label: 'Pending' };
      case TicketStatus.RESOLVED:
        return { color: 'success', label: 'Resolved' };
      case TicketStatus.CLOSED:
        return { color: 'default', label: 'Closed' };
      default:
        return { color: 'default', label: status };
    }
  };

  const { color, label } = getStatusProps();

  return (
    <Chip
      label={label}
      color={color}
      size={size}
      sx={{
        fontWeight: 500,
      }}
    />
  );
};

export default StatusBadge;
