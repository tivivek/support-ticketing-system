import React from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Typography,
  Chip,
  Autocomplete,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { type Ticket, TicketPriority, TicketStatus } from '../../../types';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store';

const ticketSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.nativeEnum(TicketPriority),
  status: z.nativeEnum(TicketStatus).optional(),
  assignedTo: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface TicketFormProps {
  initialData?: Partial<Ticket>;
  onSubmit: (data: TicketFormData) => void;
  isLoading?: boolean;
  isEditMode?: boolean;
}

const TicketForm: React.FC<TicketFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  isEditMode = false,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      priority: initialData?.priority || TicketPriority.MEDIUM,
      status: initialData?.status || TicketStatus.OPEN,
      assignedTo: initialData?.assignedTo?.id || '',
      tags: initialData?.tags || [],
    },
  });

  const userOptions = [
    { id: 'agent1', name: 'Alex Johnson' },
    { id: 'agent2', name: 'Sarah Williams' },
    { id: 'agent3', name: 'Michael Brown' },
  ];

  const tagOptions = [
    'Bug',
    'Feature Request',
    'Question',
    'Documentation',
    'UI/UX',
    'Performance',
    'Security',
  ];

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant='h6' gutterBottom>
        {isEditMode ? 'Edit Ticket' : 'Create New Ticket'}
      </Typography>

      <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name='title'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin='normal'
              fullWidth
              label='Ticket Title'
              error={!!errors.title}
              helperText={errors.title?.message}
              autoFocus
              disabled={isLoading}
            />
          )}
        />

        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              margin='normal'
              fullWidth
              label='Description'
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={isLoading}
            />
          )}
        />

        <Box sx={{ display: 'flex', mt: 2, gap: 2 }}>
          <Controller
            name='priority'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.priority}>
                <InputLabel>Priority</InputLabel>
                <Select {...field} label='Priority' disabled={isLoading}>
                  {Object.values(TicketPriority).map((priority) => (
                    <MenuItem key={priority} value={priority}>
                      {priority}
                    </MenuItem>
                  ))}
                </Select>
                {errors.priority && (
                  <FormHelperText>{errors.priority.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />

          {isEditMode && (
            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label='Status' disabled={isLoading}>
                    {Object.values(TicketStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.replace('_', ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.status && (
                    <FormHelperText>{errors.status.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          )}
        </Box>

        {(isEditMode || user?.role !== 'CUSTOMER') && (
          <Controller
            name='assignedTo'
            control={control}
            render={({ field }) => (
              <FormControl fullWidth sx={{ mt: 2 }} error={!!errors.assignedTo}>
                <InputLabel>Assign To</InputLabel>
                <Select {...field} label='Assign To' disabled={isLoading}>
                  <MenuItem value=''>
                    <em>Unassigned</em>
                  </MenuItem>
                  {userOptions.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.assignedTo && (
                  <FormHelperText>{errors.assignedTo.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        )}

        <Controller
          name='tags'
          control={control}
          render={({ field }) => (
            <Autocomplete
              {...field}
              multiple
              options={tagOptions}
              freeSolo
              onChange={(_, value) => field.onChange(value)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant='outlined'
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Tags'
                  margin='normal'
                  fullWidth
                  error={!!errors.tags}
                  helperText={errors.tags?.message}
                />
              )}
              disabled={isLoading}
            />
          )}
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type='submit'
            variant='contained'
            color='primary'
            disabled={isLoading}
            startIcon={
              isLoading ? <CircularProgress size={20} color='inherit' /> : null
            }
          >
            {isEditMode ? 'Update Ticket' : 'Create Ticket'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default TicketForm;
