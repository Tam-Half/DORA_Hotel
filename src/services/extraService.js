import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './api';

export const extraServiceApi = createApi({
    reducerPath: 'extraServiceApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['ExtraService'],
    endpoints: (builder) => ({
        getAllExtraServices: builder.query({
            query: () => ({
                url: '/extra-service/',
                method: 'GET',
            }),
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'ExtraService', id })),
                        { type: 'ExtraService', id: 'LIST' },
                    ]
                    : [{ type: 'ExtraService', id: 'LIST' }],
        }),
        getExtraServiceById: builder.query({
            query: (id) => ({
                url: `/extra-service/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'ExtraService', id }],
        }),
        createExtraService: builder.mutation({
            query: (newService) => ({
                url: '/extra-service/',
                method: 'POST',
                data: newService,
            }),
            invalidatesTags: [{ type: 'ExtraService', id: 'LIST' }],
        }),
        updateExtraService: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/extra-service/${id}`,
                method: 'PATCH',
                data: patch,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'ExtraService', id },
                { type: 'ExtraService', id: 'LIST' },
            ],
        }),
        deleteExtraService: builder.mutation({
            query: (id) => ({
                url: `/extra-service/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'ExtraService', id },
                { type: 'ExtraService', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetAllExtraServicesQuery,
    useGetExtraServiceByIdQuery,
    useCreateExtraServiceMutation,
    useUpdateExtraServiceMutation,
    useDeleteExtraServiceMutation,
} = extraServiceApi;
