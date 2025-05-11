import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
// import { messagesAPI } from '../../services/api';
import { messagesAPI } from '../../mocks/mockApi';

import type { Message } from '../../types';

interface MessagesState {
  messages: Record<string, Message[]>; // Key is ticketId
  isLoading: boolean;
  error: string | null;
}

const initialState: MessagesState = {
  messages: {},
  isLoading: false,
  error: null,
};

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (ticketId: string, { rejectWithValue }) => {
    try {
      const messages = await messagesAPI.getMessages(ticketId);
      return { ticketId, messages };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch messages'
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (
    {
      ticketId,
      content,
      attachments,
    }: { ticketId: string; content: string; attachments?: File[] },
    { rejectWithValue }
  ) => {
    try {
      const message = await messagesAPI.createMessage(
        ticketId,
        content,
        attachments
      );
      return message;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      );
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const { ticketId } = action.payload;
      if (!state.messages[ticketId]) {
        state.messages[ticketId] = [];
      }
      state.messages[ticketId].push(action.payload);
    },
    clearMessages: (state, action: PayloadAction<string>) => {
      delete state.messages[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchMessages.fulfilled,
        (
          state,
          action: PayloadAction<{ ticketId: string; messages: Message[] }>
        ) => {
          state.isLoading = false;
          state.messages[action.payload.ticketId] = action.payload.messages;
        }
      )
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send message
      .addCase(
        sendMessage.fulfilled,
        (state, action: PayloadAction<Message>) => {
          const { ticketId } = action.payload;
          if (!state.messages[ticketId]) {
            state.messages[ticketId] = [];
          }
          state.messages[ticketId].push(action.payload);
        }
      );
  },
});

export const { addMessage, clearMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
