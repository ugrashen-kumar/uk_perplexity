import axios from 'axios'

const api = axios.create({
    baseURL : "http://localhost:3000",
    withCredentials : true
})


export const register = async(registerData) =>{
    const response = await api.post('/api/auth/register', registerData)
    return response.data
}

export const login = async(loginData) =>{
    const response = await api.post('/api/auth/login', loginData)
    return response.data
}

export const getMe = async() =>{
    const response = await api.get('/api/auth/get-me')
    return response.data
}