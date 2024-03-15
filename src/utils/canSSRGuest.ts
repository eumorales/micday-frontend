import {GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult} from 'next'
import { parseCookies } from 'nookies'

export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);

        if(cookies['@fisio.tipoUsuario'] === 'Fisioterapeuta'){
            return {
                redirect: {
                    destination: '/dashboard/fisioterapeuta', 
                    permanent: false,
                }
            }
        }

        if(cookies['@fisio.tipoUsuario'] === 'Paciente'){
            return {
                redirect: {
                    destination: '/dashboard/paciente', 
                    permanent: false,
                }
            }
        }

        return await fn(ctx);
    }
}