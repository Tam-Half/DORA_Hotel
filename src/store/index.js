import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { availabilityApi } from '../services/availability';
import { extraServiceApi } from '../services/extraService';
import { roomTypeApi } from '../services/roomType';

export const store = configureStore({
    reducer: {
        // Add the generated reducer as a specific top-level slice
        [availabilityApi.reducerPath]: availabilityApi.reducer,
        [extraServiceApi.reducerPath]: extraServiceApi.reducer,
        [roomTypeApi.reducerPath]: roomTypeApi.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            availabilityApi.middleware,
            extraServiceApi.middleware,
            roomTypeApi.middleware
        ),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
