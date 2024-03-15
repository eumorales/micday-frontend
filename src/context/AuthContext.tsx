import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router from "next/router";

import { api } from "../services/apiClient";

import {toast} from 'react-toastify'

interface AuthContextData {
  usuario: UsuarioProps;
  authUsuario: boolean;
  logarUsuario: (credenciais: LogarUsuarioProps) => Promise<void>;
  cadastrarUsuario: (credenciais: CadastrarUsuarioProps) => Promise<void>;
  deslogarUsuario: () => Promise<void>;
}

interface UsuarioProps {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  cpf: string;
  telefone: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface LogarUsuarioProps {
  emailOuCpf: string;
  senha: string;
}

interface CadastrarUsuarioProps {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  tipo: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function deslogarUsuario() {
  console.log("ERROR LOGOUT");
  try {
    destroyCookie(null, "@fisio.token", { path: "/" });
    Router.push("/");
  } catch (err) {
    console.log("Erro ao sair");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioProps>();
  const authUsuario = !!usuario;

  useEffect(() => {
    const { "@fisio.token": token } = parseCookies();

    if (token) {
      api
        .get("/detalhes")
        .then((response) => {
          const { id, nome, email, cpf, telefone, tipo } = response.data;
          setUsuario({
            id,
            nome,
            email,
            cpf,
            telefone,
            tipo,
          });
        })
        .catch(() => {
          deslogarUsuario();
        });
    }
  }, []);

  async function logarUsuario({ emailOuCpf, senha }: LogarUsuarioProps) {
    try {
      const response = await api.post("/login", {
        emailOuCpf,
        senha,
      });

      const { id, nome, tipo, email, cpf, telefone, tokenUsuario } = response.data;
      
      setCookie(undefined, "@fisio.token", tokenUsuario, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setCookie(undefined, "@fisio.tipoUsuario", tipo, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setUsuario({
        id,
        nome,
        email,
        tipo,
        telefone,
        cpf,
      });

      api.defaults.headers.common["Authorization"] = `Bearer ${tokenUsuario}`;

      const rota =
        tipo === "Fisioterapeuta"
          ? "/dashboard/fisioterapeuta"
          : "/dashboard/paciente";
      Router.push(rota);
    } catch (err) {
      toast.error("Email ou senha incorreto");
      console.log("Erro ao entrar!", err);
    }
  }

  async function cadastrarUsuario({
    nome,
    email,
    senha,
    cpf,
    telefone,
    tipo,
  }: CadastrarUsuarioProps) {
    try {
      const response = await api.post("/usuarios", {
        nome,
        email,
        senha,
        cpf,
        telefone,
        tipo,
      });

      const novoUsuarioId = response.data.id;

      const rota =
        tipo === "Fisioterapeuta"
          ? `/cadastro/fisioterapeuta?id=${novoUsuarioId}`
          : `/cadastro/paciente?id=${novoUsuarioId}`;
      Router.push(rota);
    } catch (err) {
      toast.error("Dados inválidos.")
      console.log(err);
      
    }
  }

  async function deslogarUsuario() {
    try {
      destroyCookie(null, "@fisio.token", { path: "/" });
      destroyCookie(null, "@fisio.tipoUsuario", { path: "/" });
      Router.push("/");
      setUsuario(null);
    } catch (err) {
      console.log("Erro ao sair.", err);
    }
  }

  

  return (
    <AuthContext.Provider
      value={{
        usuario,
        authUsuario,
        logarUsuario,
        cadastrarUsuario,
        deslogarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
