import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {limitDefaultValue, sortKeyDefaultValue, sortUdDefaultValue} from "../config/appConfig";

type listState = {
    page: number,
    last_page: number,
    sort_key: string,
    sort_ud: string,
    limit: number,
};

const initialState: listState = {
    page: 0,
    last_page: 0,
    sort_key: sortKeyDefaultValue,
    sort_ud: sortUdDefaultValue,
    limit: limitDefaultValue,
};

const listSlice = createSlice({
    name: 'list',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
            if (state.page < 1) {
                state.page = 1;
            }
        },
        setLastPage: (state, action: PayloadAction<number>) => {
            state.last_page = action.payload;
            if (state.last_page < state.page) {
                state.page = state.last_page;
            }
        },
        setSortKey: (state, action: PayloadAction<string>) => {
            state.sort_key = action.payload;
        },
        setSortUd: (state, action: PayloadAction<string>) => {
            state.sort_ud = action.payload;
        },
        setLimit: (state, action: PayloadAction<number>) => {
            state.limit = action.payload;
        },
        nextPage: (state) => {
            state.page++;
            if (state.last_page < state.page) {
                state.page = state.last_page;
            }
        },
        previousPage: (state) => {
            state.page--;
            if (state.page < 1) {
                state.page = 1;
            }
        },
    }
});

export const {setPage, setLastPage, setSortKey, setSortUd, setLimit, nextPage, previousPage} = listSlice.actions;

// 簡単に参照する
// export const getPage = (state: any) => state.list.page;

export default listSlice.reducer;
