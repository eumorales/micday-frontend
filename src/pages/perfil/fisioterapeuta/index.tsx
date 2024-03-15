import { useState } from "react";

import Head from "next/head";

import {
  Flex,
  Text,
  Heading,
  Input,
  Button,
  useMediaQuery,
  Box,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";

import { SidebarFisioterapeuta } from "@/components/sidebar/fisioterapeuta";

import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { Icon } from "@chakra-ui/react";
import { FiChevronLeft } from "react-icons/fi";
import {
  HiUser,
  HiClipboardList,
  HiIdentification,
  HiHome,
  HiPhone,
} from "react-icons/hi";
import { EmailIcon } from "@chakra-ui/icons";

import Link from "next/link";
import { toast } from "react-toastify";

interface UsuarioProps {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
}

interface FisioterapeutaProps {
  id: string;
  crefito: string;
  atuacao: string;
}

interface PerfilProps {
  fisioterapeuta: FisioterapeutaProps;
  usuario: UsuarioProps;
}

export default function PerfilFisioterapeuta({
  usuario,
  fisioterapeuta,
}: PerfilProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const [nome, setNome] = useState(usuario && usuario?.nome);
  const [email, setEmail] = useState(usuario && usuario?.email);
  const [cpf, setCpf] = useState(usuario && usuario?.cpf);
  const [telefone, setTelefone] = useState(usuario && usuario?.telefone);
  const [crefito, setCrefito] = useState(
    fisioterapeuta && fisioterapeuta?.crefito
  );
  const [atuacao, setAtuacao] = useState(
    fisioterapeuta && fisioterapeuta?.atuacao
  );

  async function handleEditarUsuario() {
    if (
      nome === "" ||
      cpf === "" ||
      telefone === "" ||
      crefito === "" ||
      atuacao === ""
    ) {
      toast.error("Dados incompletos.");
      return;
    }

    if (cpf.length != 11) {
      toast.warning("CPF Inválido! Informe apenas os 11 números.");
      return;
    }

    if (crefito.length < 5) {
      toast.warning("Informe um código CREFITO válido!");
      return;
    }

    try {
      const apiClient = setupAPIClient();

      await apiClient.put("/usuario", {
        nome: nome,
        cpf: cpf,
      });

      await apiClient.put("/fisioterapeuta", {
        crefito: crefito,
        atuacao: atuacao,
      });

      toast.success("Perfil atualizado sucesso!");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao editar perfil");
    }
  }

  return (
    <>
      <Head>
        <title>Minha Conta | mic.day</title>
      </Head>
      <SidebarFisioterapeuta>
        <Flex direction="column" alignItems="center" justifyContent="center">
          <Flex
            w="100%"
            maxW="1100"
            direction={"row"}
            alignItems="center"
            justifyContent="center"
          >
            <Box
              w="85%"
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              mt={4}
            >
              <Link href="/dashboard/paciente">
                <Button
                  display="flex"
                  alignItems="center"
                  justifyItems="center"
                  mr={4}
                  mb={isMobile ? 4 : 0}
                  bg="pink.50"
                  borderColor="pink.700"
                  _hover={{ bg: "pink.50" }}
                >
                  <FiChevronLeft size={24} color="#B83280" />
                  Voltar
                </Button>
              </Link>
              <Heading fontSize={"3xl"} color="pink.700">
                Configurações do Perfil
              </Heading>
            </Box>
          </Flex>
          <Flex
            pt={isMobile ? 6 : 8}
            pb={8}
            fontSize="lg"
            w="100%"
            maxW="1100"
            direction={"column"}
            alignItems="center"
            justifyContent={"center"}
          >
            <Flex direction={"column"} w={"85%"}>
              <Text
                mb={2}
                fontSize={isMobile ? "lg" : "xl"}
                fontWeight="medium"
              >
                Nome completo
              </Text>
              <InputGroup size="lg">
                <InputLeftElement
                  children={<Icon as={HiUser} color="gray.400" w={5} h={5} />}
                />
                <Input
                  w="100%"
                  placeholder="Nome do paciente"
                  focusBorderColor="pink.700"
                  size="lg"
                  type="text"
                  mb={3}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </InputGroup>

              <Text
                mb={2}
                fontSize={isMobile ? "lg" : "xl"}
                fontWeight="medium"
              >
                Email
              </Text>
              <InputGroup size="lg">
                <InputLeftElement children={<EmailIcon color="gray.400" />} />
                <Input
                  isReadOnly={true}
                  variant={"outline"}
                  size="lg"
                  placeholder="email@email.com"
                  _placeholder={{ color: "gray.400" }}
                  focusBorderColor="pink.500"
                  type="email"
                  mb={3}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>

              <Text
                mb={2}
                fontSize={isMobile ? "lg" : "xl"}
                fontWeight="medium"
              >
                Número de celular
              </Text>
              <InputGroup size="lg">
                <InputLeftElement
                  children={<Icon as={HiPhone} color="gray.400" w={5} h={5} />}
                />
                <Input
                  size="lg"
                  placeholder="(55) 99999-9999"
                  _placeholder={{ color: "gray.400" }}
                  focusBorderColor="pink.700"
                  type="text"
                  maxLength={15}
                  mb={3}
                  value={telefone}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 16) {
                      setTelefone(inputValue);
                    }
                  }}
                />
              </InputGroup>

              <Text
                mb={2}
                fontSize={isMobile ? "lg" : "xl"}
                fontWeight="medium"
              >
                CPF
              </Text>
              <InputGroup size="lg">
                <InputLeftElement
                  children={
                    <Icon as={HiIdentification} color="gray.400" w={5} h={5} />
                  }
                />
                <Input
                  w="100%"
                  placeholder="CPF do paciente"
                  focusBorderColor="pink.700"
                  size="lg"
                  type="number"
                  mb={3}
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                />
              </InputGroup>

              <Text
                mb={2}
                fontSize={isMobile ? "lg" : "xl"}
                fontWeight="medium"
              >
                Crefito
              </Text>
              <InputGroup size="lg">
                <InputLeftElement
                  children={
                    <Icon as={HiClipboardList} color="gray.400" w={5} h={5} />
                  }
                />
                <Input
                  w="100%"
                  placeholder="Crefito do Fisioterapeuta"
                  focusBorderColor="pink.700"
                  size="lg"
                  type="text"
                  mb={3}
                  value={crefito}
                  onChange={(e) => setCrefito(e.target.value)}
                />
              </InputGroup>

              <Text
                mb={2}
                fontSize={isMobile ? "lg" : "xl"}
                fontWeight="medium"
              >
                Local de atuação:{" "}
              </Text>
              <InputGroup size="lg">
                <InputLeftElement
                  children={<Icon as={HiHome} color="gray.400" w={5} h={5} />}
                />
                <Input
                  w="100%"
                  placeholder="Local de atuação do Fisioterapeuta"
                  focusBorderColor="pink.700"
                  size="lg"
                  type="text"
                  mb={3}
                  value={atuacao}
                  onChange={(e) => setAtuacao(e.target.value)}
                />
              </InputGroup>

              <Button
                w="25%"
                mt={4}
                mb={3}
                bg="pink.600"
                color="white"
                size="lg"
                _hover={{ bg: "pink.500" }}
                onClick={handleEditarUsuario}
                mr={4}
              >
                Salvar
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </SidebarFisioterapeuta>
    </>
  );
}

export const getServerSideProps = canSSRAuth("Fisioterapeuta", async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);

    const usuarioResponse = await apiClient.get("/detalhes");

    const usuario = {
      id: usuarioResponse.data["usuario"]["id"],
      nome: usuarioResponse.data["usuario"]["nome"],
      email: usuarioResponse.data["usuario"]["email"],
      cpf: usuarioResponse.data["usuario"]["cpf"],
      telefone: usuarioResponse.data["usuario"]["telefone"],
    };

    const response = await apiClient.get("/fisioterapeuta/detalhes");

    const fisioterapeuta = {
      id: response.data["fisioterapeuta"]["id"],
      crefito: response.data["fisioterapeuta"]["crefito"],
      atuacao: response.data["fisioterapeuta"]["atuacao"],
    };

    return {
      props: {
        usuario: usuario,
        fisioterapeuta: fisioterapeuta,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      redirect: {
        destination: "/dashboard/fisioterapeuta",
        permanent: false,
      },
    };
  }
});
