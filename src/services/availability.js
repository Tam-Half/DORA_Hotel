import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api';

export const availabilityApi = createApi({
    reducerPath: 'availabilityApi',
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        searchAvailability: builder.mutation({
            query: (searchParams) => ({
                url: '/availability/search',
                method: 'POST',
                data: searchParams,
            }),
        }),
    }),
});

export const { useSearchAvailabilityMutation } = availabilityApi;
