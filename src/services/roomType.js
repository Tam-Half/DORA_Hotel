import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api';

export const roomTypeApi = createApi({
    reducerPath: 'roomTypeApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['RoomType'],
    endpoints: (builder) => ({
        getAllRoomTypes: builder.query({
            query: () => ({
                url: '/room-type/',
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'RoomType', id })),
                        { type: 'RoomType', id: 'LIST' },
                    ]
                    : [{ type: 'RoomType', id: 'LIST' }],
        }),
        getRoomTypeById: builder.query({
            query: ({ id, params }) => ({
                url: `/room-type/${id}`,
                method: 'GET',
                params,
            }),
            providesTags: (result, error, { id }) => [{ type: 'RoomType', id }],
        }),
    }),
});
export const {
    useGetAllRoomTypesQuery,
    useGetRoomTypeByIdQuery,
} = roomTypeApi;
