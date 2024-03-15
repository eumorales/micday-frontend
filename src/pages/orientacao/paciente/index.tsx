import { useState } from "react";
import { SidebarPaciente } from "@/components/sidebar/paciente";
import {
  Text,
  Flex,
  Button,
  Heading,
  useMediaQuery,
  VStack,
  Box,
  Checkbox,
} from "@chakra-ui/react";
import Head from "next/head";

import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import { format } from "date-fns";
import { TiInputChecked } from "react-icons/ti";
import { toast } from "react-toastify";
import Router from "next/router";

interface OrientacaoItem {
  id: string;
  descricao: string;
  data: Date;
  status: boolean;
  fisioterapeuta: {
    id: string;
    usuario: {
      nome: string;
    };
  };
}

interface OrientacaoListProps {
  orientacoes: OrientacaoItem[];
}

export default function OrientacoesPaciente({
  orientacoes,
}: OrientacaoListProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const orientacoesOrdenadas = orientacoes.sort((a, b) => {
    const dataA = new Date(a.data).getTime();
    const dataB = new Date(b.data).getTime();
    return dataB - dataA;
  });

  const [listOrientacoes, setListOrientacoes] = useState(orientacoesOrdenadas);

  async function marcarComoLido(orientacaoId) {
    try {
      const apiClient = setupAPIClient();
      await apiClient.put(`/orientacoes/marcar/${orientacaoId}`, {
        status: true,
      });
      
      Router.push("/orientacao/paciente");

      setListOrientacoes((prevOrientacoes) =>
        prevOrientacoes.map((orientacao) => {
          if (orientacao.id === orientacaoId) {
            return { ...orientacao, status: true };
          }
          return orientacao;
        })
      );

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Minhas Orientações | mic.day</title>
      </Head>
      <SidebarPaciente>
        <Flex direction="column" alignItems="center" justifyContent="center">
          <Flex
            maxW="1100px"
            direction={isMobile ? "column" : "row"}
            w="100%"
            align={isMobile ? "flex-start" : "center"}
            mb={isMobile ? 4 : 0}
          >
            <Link href="/dashboard/paciente">
              <Button
                p={4}
                display="flex"
                alignItems="center"
                justifyItems="center"
                mr={4}
                bg="pink.50"
                borderColor="pink.700"
                _hover={{ bg: "pink.50" }}
              >
                <FiChevronLeft size={24} color="#B83280" />
                Voltar
              </Button>
            </Link>
            <Heading
              color="pink.700"
              mt={4}
              mr={4}
              mb={isMobile ? 0 : 4}
              fontSize={isMobile ? "28px" : "3xl"}
            >
              Minhas Orientações
            </Heading>
          </Flex>

          <VStack
            align="stretch"
            spacing={4}
            w="100%"
            maxW="1100px"
            mt={isMobile ? 0 : 2}
          >
            {orientacoesOrdenadas.map((orientacao) => (
              <Box key={orientacao.id} borderBottomWidth={2} fontSize="lg">
                <Text borderTopWidth={2} borderBottomWidth={2} p={2}>
                  {format(new Date(orientacao.data), "dd/MM/yyyy HH:mm")} |
                  Fisioterapeuta:
                  <strong> {orientacao.fisioterapeuta.usuario.nome} </strong>
                </Text>
                <Text p={2}>
                  <strong>Descrição</strong>
                </Text>
                <Text p={2}>{orientacao.descricao}</Text>
                <Button
                  leftIcon={<TiInputChecked size="20" />}
                  p={2}
                  mb={2}
                  bg="transparent"
                  color="pink.700"
                  _hover={{ bg: "transparent", color: "pink.500" }}
                  onClick={() => marcarComoLido(orientacao.id)}
                  isDisabled={orientacao.status}
                >
                  {orientacao.status ? "Lido" : "Marcar como lido"}
                </Button>
              </Box>
            ))}
          </VStack>
        </Flex>
      </SidebarPaciente>
    </>
  );
}

export const getServerSideProps = canSSRAuth("Paciente", async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/orientacoes/detalhes");

    if (response.data === null) {
      return {
        redirect: {
          destination: "/dashboard/paciente",
          permanent: false,
        },
      };
    }

    return {
      props: {
        orientacoes: response.data,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      redirect: {
        destination: "/dashboard/paciente",
        permanent: false,
      },
    };
  }
});
