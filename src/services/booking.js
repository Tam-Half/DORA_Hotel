import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api';

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Booking'],
    endpoints: (builder) => ({
        getBookingHistory: builder.query({
            query: (filters) => ({
                url: '/bookings',
                method: 'GET',
                params: filters,
            }),
            providesTags: ['Booking'],
        }),
        getBookingById: builder.query({
            query: (id) => ({
                url: `/bookings/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Booking', id }],
        }),
        createBooking: builder.mutation({
            query: (data) => ({
                url: '/bookings',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['Booking'],
        }),
        deleteBooking: builder.mutation({
            query: (id) => ({
                url: `/bookings/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Booking'],
        }),
    }),
});

export const {
    useGetBookingHistoryQuery,
    useGetBookingByIdQuery,
    useCreateBookingMutation,
    useDeleteBookingMutation,
} = bookingApi;
import api from "./api";
const bookingAPI = {
    getAll: async (params) => {
        try {
            const response = await api.get('/booking/', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    updateRoomStatus: async (bookingId, status , allocationId) => {
        try {
            const response = await api.put(`/bookings/${bookingId}/room-status`, {
                allocationId: allocationId,
                status: status
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default bookingAPI;
