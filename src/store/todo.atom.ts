const api="https://to-dos-api.softclub.tj/api/to-dos"
import {atomWithRefresh, loadable} from "jotai/utils"
import {atom} from "jotai"
import axios from "axios"
export const getDataAtom=atomWithRefresh(async(get)=>{
    try { 
        const {data}=await axios.get(api)
        return data.data 
    } catch (error) {
       console.error(error); 
       
    }
})

export const deleteUserAtom=atom(null,async(get,set,id)=>{
    try {
        await axios.delete(`${api}?id=${id}`)
        set(getDataAtom)
    } catch (error) { 
       console.error(error);
        
    } 
})

export const addUserAtom = atom(null, async (get, set, newUser) => {
    try {
        await axios.post(api, newUser)
        set(getDataAtom)
    } catch (error) {
        console.error(error);
    }
})

export const editUserAtom = atom(null, async (get, set, updatedUser) => {
    try {
        await axios.put(api, updatedUser)
        set(getDataAtom)
    } catch (error) {
        console.error(error);
    }
})




export const getLoadableAtom=loadable(getDataAtom)