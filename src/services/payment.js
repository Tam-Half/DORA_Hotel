import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api';

export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Payment'],
    endpoints: (builder) => ({
        createPayOSLink: builder.mutation({
            query: (data) => ({
                url: '/payments/payos/create-link',
                method: 'POST',
                data,
            }),
        }),
        getAllPayments: builder.query({
            query: () => ({
                url: '/payments',
                method: 'GET',
            }),
            providesTags: ['Payment'],
        }),
        verifyPayOSStatus: builder.mutation({
            query: (data) => ({
                url: '/payments/payos/verify-status',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Booking'], // Assuming we have booking tags to refresh
        }),
    }),
});

export const {
    useCreatePayOSLinkMutation,
    useGetAllPaymentsQuery,
    useVerifyPayOSStatusMutation,
} = paymentApi;
