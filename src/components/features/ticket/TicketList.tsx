import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Chip,
  Pagination,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  fetchTickets,
  setPage,
  setFilter,
  clearFilters,
  setSorting,
} from '../../../store/slices/ticketsSlice';
import type { AppDispatch, RootState } from '../../../store';
import { TicketStatus, TicketPriority, type Ticket } from '../../../types';
import PriorityBadge from '../../../common/PriorityBadge';
import StatusBadge from '../../../common/StatusBadge';

const TicketList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { tickets, pagination, filters, sorting, isLoading } = useSelector(
    (state: RootState) => state.tickets
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch, pagination.page, pagination.pageSize, filters, sorting]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPage(page));
  };

  const handleSearch = () => {
    dispatch(setFilter({ key: 'search', value: searchTerm }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(
      setFilter({ key: 'status', value: event.target.value as TicketStatus })
    );
  };

  const handlePriorityChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    dispatch(
      setFilter({
        key: 'priority',
        value: event.target.value as TicketPriority,
      })
    );
  };

  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    const [sortBy, sortOrder] = value.split('-');
    dispatch(setSorting({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchTerm('');
  };

  const handleTicketClick = (ticket: Ticket) => {
    navigate(`/tickets/${ticket.id}`);
  };

  const renderTicketItem = (ticket: Ticket) => {
    return (
      <ListItem
        button
        key={ticket.id}
        onClick={() => handleTicketClick(ticket)}
        sx={{
          mb: 1,
          borderRadius: 1,
          boxShadow: 1,
          bgcolor: 'background.paper',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
        }}
      >
        <ListItemAvatar>
          <Avatar src={ticket.createdBy.avatar}>
            {ticket.createdBy.name.charAt(0)}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant='subtitle1' fontWeight='medium' noWrap>
              {ticket.title}
            </Typography>
          }
          secondary={
            <Box component='span' sx={{ display: 'block' }}>
              <Typography variant='body2' color='text.secondary' noWrap>
                {ticket.description.substring(0, 60)}
                {ticket.description.length > 60 ? '...' : ''}
              </Typography>
              <Box
                sx={{
                  mt: 1,
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                }}
              >
                <Typography variant='caption' color='text.secondary'>
                  #{ticket.id.slice(0, 8)} •{' '}
                  {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                </Typography>
                {ticket.tags &&
                  ticket.tags.length > 0 &&
                  ticket.tags
                    .slice(0, 2)
                    .map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size='small'
                        variant='outlined'
                        sx={{ mr: 0.5 }}
                      />
                    ))}
                {ticket.tags && ticket.tags.length > 2 && (
                  <Chip
                    label={`+${ticket.tags.length - 2}`}
                    size='small'
                    variant='outlined'
                  />
                )}
              </Box>
            </Box>
          }
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            ml: 1,
            minWidth: isMobile ? 'auto' : 150,
          }}
        >
          <Box sx={{ mb: 1 }}>
            <StatusBadge status={ticket.status} size='small' />
          </Box>
          <PriorityBadge priority={ticket.priority} size='small' />
        </Box>
      </ListItem>
    );
  };

  const renderSkeletonItems = () => {
    return Array(5)
      .fill(null)
      .map((_, index) => (
        <ListItem key={index} sx={{ mb: 1, borderRadius: 1, boxShadow: 1 }}>
          <ListItemAvatar>
            <Skeleton variant='circular' width={40} height={40} />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton variant='text' width='70%' />}
            secondary={
              <Box>
                <Skeleton variant='text' width='90%' />
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Skeleton variant='rounded' width={60} height={20} />
                  <Skeleton variant='rounded' width={60} height={20} />
                </Box>
              </Box>
            }
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              ml: 1,
              minWidth: isMobile ? 'auto' : 150,
            }}
          >
            <Skeleton variant='rounded' width={80} height={24} sx={{ mb: 1 }} />
            <Skeleton variant='rounded' width={80} height={24} />
          </Box>
        </ListItem>
      ));
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant='h5' component='h1'>
            Support Tickets
          </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={() => navigate('/tickets/new')}
          >
            New Ticket
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 2,
            mb: 2,
          }}
        >
          <TextField
            placeholder='Search tickets...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <Button
                    variant='contained'
                    color='primary'
                    size='small'
                    onClick={handleSearch}
                  >
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
            fullWidth
            variant='outlined'
            size='small'
          />

          <Button
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            variant={showFilterPanel ? 'contained' : 'outlined'}
            color='primary'
            sx={{ minWidth: isMobile ? '100%' : 120 }}
          >
            Filters
          </Button>
        </Box>

        {showFilterPanel && (
          <Box
            sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}
          >
            <Typography variant='subtitle2' gutterBottom>
              Filters & Sorting
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <FormControl sx={{ minWidth: 150 }} size='small'>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={handleStatusChange}
                  label='Status'
                >
                  <MenuItem value=''>All</MenuItem>
                  {Object.values(TicketStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 150 }} size='small'>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority || ''}
                  onChange={handlePriorityChange}
                  label='Priority'
                >
                  <MenuItem value=''>All</MenuItem>
                  {Object.values(TicketPriority).map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 180 }} size='small'>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={`${sorting.sortBy}-${sorting.sortOrder}`}
                  onChange={handleSortChange}
                  label='Sort By'
                >
                  <MenuItem value='createdAt-desc'>Newest First</MenuItem>
                  <MenuItem value='createdAt-asc'>Oldest First</MenuItem>
                  <MenuItem value='priority-desc'>Priority (High-Low)</MenuItem>
                  <MenuItem value='priority-asc'>Priority (Low-High)</MenuItem>
                  <MenuItem value='status-asc'>Status</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant='outlined'
                color='secondary'
                size='small'
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </Box>
          </Box>
        )}

        <Divider sx={{ mb: 2 }} />

        <List>
          {isLoading ? (
            renderSkeletonItems()
          ) : tickets.length > 0 ? (
            tickets.map(renderTicketItem)
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant='body1' color='text.secondary'>
                No tickets found
              </Typography>
              <Button
                variant='contained'
                color='primary'
                onClick={() => navigate('/tickets/new')}
                sx={{ mt: 2 }}
              >
                Create your first ticket
              </Button>
            </Box>
          )}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color='primary'
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TicketList;
