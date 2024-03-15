import {GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult} from 'next'
import { destroyCookie, parseCookies } from 'nookies'
import { AuthTokenError } from '../services/errors/AuthTokenError'

export function canSSRAuth<P>(tipoUsuario: string, fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);

        const token = cookies['@fisio.token']
        const tipoUsuarioToken = cookies['@fisio.tipoUsuario']

        if(!token || !tipoUsuarioToken || tipoUsuarioToken !== tipoUsuario){
            return{
                redirect:{
                    destination: '/',
                    permanent: false,
                }
            }
        }

        try{
            return await fn(ctx);
        } catch(err){
            if(err instanceof AuthTokenError){
                destroyCookie(ctx, '@fisio.token', { path: '/'});
                destroyCookie(ctx, '@fisio.tipoUsuario', { path: '/'});

                return{
                    redirect:{
                        destination: '/',
                        permanent: false,
                    }
                }
            }
        }
    }
}