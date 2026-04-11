import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api';

export const reviewApi = createApi({
    reducerPath: 'reviewApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Review', 'RoomType'],
    endpoints: (builder) => ({
        createReview: builder.mutation({
            query: (payload) => ({
                url: '/reviews/',
                method: 'POST',
                data: payload,
            }),
            invalidatesTags: (result, error, { room_type_id }) => [
                { type: 'Review' },
                { type: 'RoomType', id: room_type_id }
            ],
        }),
        getReviewsByRoomType: builder.query({
            query: (roomTypeId) => ({
                url: `/reviews/room-type/${roomTypeId}`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Review', id })),
                        { type: 'Review', id: 'LIST' },
                    ]
                    : [{ type: 'Review', id: 'LIST' }],
        }),
        toggleReviewVisibility: builder.mutation({
            query: ({ id, is_hidden }) => ({
                url: `/reviews/${id}/visibility`,
                method: 'PATCH',
                data: { is_hidden },
            }),
            invalidatesTags: (result, error, { room_type_id }) => [
                { type: 'Review' },
                { type: 'RoomType', id: room_type_id }
            ],
        }),
    }),
});

export const {
    useCreateReviewMutation,
    useGetReviewsByRoomTypeQuery,
    useToggleReviewVisibilityMutation,
} = reviewApi;
