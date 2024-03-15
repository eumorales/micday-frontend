import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'

import { AuthTokenError} from './errors/AuthTokenError'

import { deslogarUsuario } from '../context/AuthContext'

export function setupAPIClient(ctx = undefined){
    let cookies = parseCookies(ctx);

    const api = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers:{
            Authorization: `Bearer ${cookies['@fisio.token']} ${cookies['@fisio.tipoUsuario']}`
        }
    })

    api.interceptors.response.use(response => {
        return response;
    }, (error: AxiosError) => {
        if(error.response.status === 401){
            if(typeof window !== undefined){
                deslogarUsuario();
            } else {
                return Promise.reject(new AuthTokenError)
            }
        }

        return Promise.reject(error);

    })

    return api;
}