import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api';

export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: (messagePayload) => ({
                url: '/chat',
                method: 'POST',
                data: messagePayload,
            }),
        }),
    }),
});

export const { useSendMessageMutation } = chatApi;
