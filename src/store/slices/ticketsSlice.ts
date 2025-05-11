import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { ticketsAPI } from '../../mocks/mockApi';

import {
  type PaginatedResponse,
  type Ticket,
  TicketStatus,
  TicketPriority,
} from '../../types';

interface TicketsState {
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status?: TicketStatus;
    priority?: TicketPriority;
    assignedTo?: string;
    tags?: string[];
    search?: string;
  };
  sorting: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: TicketsState = {
  tickets: [],
  selectedTicket: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  sorting: {
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  isLoading: false,
  error: null,
};

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { tickets: TicketsState };
      const { pagination, filters, sorting } = state.tickets;

      const response = await ticketsAPI.getTickets({
        page: pagination.page,
        pageSize: pagination.pageSize,
        status: filters.status,
        priority: filters.priority,
        assignedTo: filters.assignedTo,
        tags: filters.tags,
        search: filters.search,
        sortBy: sorting.sortBy,
        sortOrder: sorting.sortOrder,
      });

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch tickets'
      );
    }
  }
);

export const fetchTicketById = createAsyncThunk(
  'tickets/fetchTicketById',
  async (id: string, { rejectWithValue }) => {
    try {
      const ticket = await ticketsAPI.getTicketById(id);
      return ticket;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch ticket'
      );
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticket: Partial<Ticket>, { rejectWithValue }) => {
    try {
      const newTicket = await ticketsAPI.createTicket(ticket);
      return newTicket;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create ticket'
      );
    }
  }
);

export const updateTicketAsync = createAsyncThunk(
  'tickets/updateTicket',
  async (
    { id, ticket }: { id: string; ticket: Partial<Ticket> },
    { rejectWithValue }
  ) => {
    try {
      const updatedTicket = await ticketsAPI.updateTicket(id, ticket);
      return updatedTicket;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update ticket'
      );
    }
  }
);

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1; // Reset to first page when changing page size
    },
    setFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      const { key, value } = action.payload;
      (state.filters as any)[key] = value;
      state.pagination.page = 1; // Reset to first page when applying filters
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setSorting: (
      state,
      action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>
    ) => {
      state.sorting = action.payload;
    },
    updateTicket: (state, action: PayloadAction<Ticket>) => {
      const index = state.tickets.findIndex(
        (ticket) => ticket.id === action.payload.id
      );
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }

      // Also update selected ticket if it's the same one
      if (
        state.selectedTicket &&
        state.selectedTicket.id === action.payload.id
      ) {
        state.selectedTicket = action.payload;
      }
    },
    setSelectedTicket: (state, action: PayloadAction<Ticket | null>) => {
      state.selectedTicket = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tickets
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTickets.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Ticket>>) => {
          state.isLoading = false;
          state.tickets = action.payload.data;
          state.pagination = {
            page: action.payload.page,
            pageSize: action.payload.pageSize,
            total: action.payload.total,
            totalPages: action.payload.totalPages,
          };
        }
      )
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch ticket by ID
      .addCase(fetchTicketById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTicketById.fulfilled,
        (state, action: PayloadAction<Ticket>) => {
          state.isLoading = false;
          state.selectedTicket = action.payload;
        }
      )
      .addCase(fetchTicketById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create ticket
      .addCase(
        createTicket.fulfilled,
        (state, action: PayloadAction<Ticket>) => {
          state.tickets = [action.payload, ...state.tickets];
          state.pagination.total += 1;
        }
      )
      // Update ticket
      .addCase(
        updateTicketAsync.fulfilled,
        (state, action: PayloadAction<Ticket>) => {
          const index = state.tickets.findIndex(
            (ticket) => ticket.id === action.payload.id
          );
          if (index !== -1) {
            state.tickets[index] = action.payload;
          }

          if (
            state.selectedTicket &&
            state.selectedTicket.id === action.payload.id
          ) {
            state.selectedTicket = action.payload;
          }
        }
      );
  },
});

export const {
  setPage,
  setPageSize,
  setFilter,
  clearFilters,
  setSorting,
  updateTicket,
  setSelectedTicket,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;
