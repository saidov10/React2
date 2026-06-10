import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
    id: string
    name: string
    status: boolean
}

export interface UserState {
    users: User[]
}

const initialState: UserState = {
    users: [
        { id: "1", name: "Alexander Wright", status: true },
        { id: "2", name: "Sophia Martinez", status: false },
        { id: "3", name: "Liam Gallagher", status: true },
        { id: "4", name: "Olivia Thompson", status: true },
        { id: "5", name: "Ethan Hunt", status: false },
        { id: "6", name: "Emma Watson", status: true },
        { id: "7", name: "George Brooks", status: false },
        { id: "8", name: "Hannah Abbott", status: true },
        { id: "9", name: "Marcus Aurelius", status: false },
        { id: "10", name: "Isabella Rossi", status: true },
    ],
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<Omit<User, "id">>) => {
            const newId = (state.users.length > 0
                ? Math.max(...state.users.map(u => parseInt(u.id) || 0)) + 1
                : 1
            ).toString()

            state.users.push({
                id: newId,
                ...action.payload,
            })
        },
        editUser: (state, action: PayloadAction<User>) => {
            const index = state.users.findIndex(u => u.id === action.payload.id)
            if (index !== -1) {
                state.users[index] = action.payload
            }
        },
        deleteUser: (state, action: PayloadAction<string>) => {
            state.users = state.users.filter(u => u.id !== action.payload)
        },
        toggleUserStatus: (state, action: PayloadAction<string>) => {
            const user = state.users.find(u => u.id === action.payload)
            if (user) {
                user.status = !user.status
            }
        },
    },
})

export const { addUser, editUser, deleteUser, toggleUserStatus } = userSlice.actions
export default userSlice.reducer
