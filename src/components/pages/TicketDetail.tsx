import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Button,
  CircularProgress,
  Chip,
  Avatar,
  Card,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import {
  fetchTicketById,
  updateTicketAsync,
} from '../../store/slices/ticketsSlice';
import { fetchMessages, sendMessage } from '../../store/slices/messagesSlice';
import type { AppDispatch, RootState } from '../../store';
import MessageBubble from '../features/ticket/MessageBubble';
import MessageInput from '../features/ticket/MessageInput';
import StatusBadge from '../../common/StatusBadge';
import PriorityBadge from '../../common/PriorityBadge';
import TicketForm from '../features/ticket/TicketForm';
import { TicketStatus } from '../../types';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { selectedTicket, isLoading } = useSelector(
    (state: RootState) => state.tickets
  );
  const { messages, isLoading: isMessagesLoading } = useSelector(
    (state: RootState) => state.messages
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchTicketById(id));
      dispatch(fetchMessages(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!id || (!selectedTicket && !isLoading)) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity='error'>Ticket not found</Alert>
        <Button
          variant='contained'
          color='primary'
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tickets')}
          sx={{ mt: 2 }}
        >
          Back to Tickets
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const ticketMessages = messages[id] || [];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleEdit = () => {
    setIsEditMode(true);
    handleMenuClose();
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleUpdateTicket = async (data: any) => {
    try {
      await dispatch(updateTicketAsync({ id, ticket: data })).unwrap();
      setIsEditMode(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update ticket');
    }
  };

  const handleStatusChange = async (status: string) => {
    if (selectedTicket) {
      try {
        await dispatch(
          updateTicketAsync({
            id,
            ticket: { status: status as any },
          })
        ).unwrap();
      } catch (err: any) {
        setError(err.message || 'Failed to update status');
      }
    }
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (id) {
      try {
        await dispatch(
          sendMessage({ ticketId: id, content, attachments })
        ).unwrap();
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to send message');
      }
    }
  };

  if (isEditMode && selectedTicket) {
    return (
      <Box sx={{ p: 3 }}>
        <Button
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={handleCancelEdit}
          sx={{ mb: 3 }}
        >
          Back to Ticket
        </Button>

        {error && (
          <Alert severity='error' sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TicketForm
          initialData={selectedTicket}
          onSubmit={handleUpdateTicket}
          isEditMode
        />
      </Box>
    );
  }

  if (!selectedTicket) {
    return null;
  }

  const canEdit =
    user &&
    (user.id === selectedTicket.createdBy.id || user.role !== 'CUSTOMER');
  const canAssign = user && user.role !== 'CUSTOMER';

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          variant='outlined'
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/tickets')}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant='h5' component='h1' sx={{ flexGrow: 1 }}>
          Ticket Details
        </Typography>
        {canEdit && (
          <>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleEdit}>
                <EditIcon fontSize='small' sx={{ mr: 1 }} /> Edit Ticket
              </MenuItem>
              <MenuItem
                onClick={handleOpenDeleteDialog}
                sx={{ color: 'error.main' }}
              >
                <DeleteIcon fontSize='small' sx={{ mr: 1 }} /> Delete Ticket
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid item xs={12} md={4}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Ticket Status
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {canEdit ? (
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' gutterBottom>
                  Change Status
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.values(TicketStatus).map((status) => (
                    <Chip
                      key={status}
                      label={status.replace('_', ' ')}
                      color={
                        selectedTicket.status === status ? 'primary' : 'default'
                      }
                      variant={
                        selectedTicket.status === status ? 'filled' : 'outlined'
                      }
                      onClick={() => handleStatusChange(status)}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' gutterBottom>
                  Current Status
                </Typography>
                <StatusBadge status={selectedTicket.status} />
              </Box>
            )}

            <Typography variant='subtitle2' gutterBottom>
              Created On
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              {formatDate(selectedTicket.createdAt)}
            </Typography>

            <Typography variant='subtitle2' gutterBottom>
              Last Updated
            </Typography>
            <Typography variant='body2' sx={{ mb: 2 }}>
              {formatDate(selectedTicket.updatedAt)}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              People
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant='subtitle2' gutterBottom>
              Created By
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={selectedTicket.createdBy.avatar}
                alt={selectedTicket.createdBy.name}
                sx={{ width: 32, height: 32, mr: 1 }}
              >
                {selectedTicket?.createdBy?.name?.charAt(0)}
              </Avatar>
              <Typography variant='body2'>
                {selectedTicket.createdBy.name} (
                {selectedTicket.createdBy.email})
              </Typography>
            </Box>

            <Typography variant='subtitle2' gutterBottom>
              Assigned To
            </Typography>
            {selectedTicket.assignedTo ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={selectedTicket.assignedTo.avatar}
                  alt={selectedTicket.assignedTo.name}
                  sx={{ width: 32, height: 32, mr: 1 }}
                >
                  {selectedTicket.assignedTo.name.charAt(0)}
                </Avatar>
                <Typography variant='body2'>
                  {selectedTicket.assignedTo.name} (
                  {selectedTicket.assignedTo.email})
                </Typography>
              </Box>
            ) : (
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                No agent assigned yet
              </Typography>
            )}

            {canAssign && (
              <Button
                variant='outlined'
                color='primary'
                size='small'
                fullWidth
                onClick={handleEdit}
              >
                {selectedTicket.assignedTo
                  ? 'Reassign Ticket'
                  : 'Assign Ticket'}
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Ticket</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this ticket? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            color='error'
            onClick={() => {
              // In a real app, implement delete functionality here
              handleCloseDeleteDialog();
              navigate('/tickets');
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketDetail;
