import { useState, useEffect } from "react";
import { SidebarFisioterapeuta } from "@/components/sidebar/fisioterapeuta";
import Head from "next/head";

import {
  Flex,
  Heading,
  Button,
  useMediaQuery,
  Table,
  Tbody,
  Td,
  Box,
  Text,
  Th,
  Thead,
  Tr,
  TableContainer
} from "@chakra-ui/react";

import { FiChevronLeft } from "react-icons/fi";
import { Icon } from "@chakra-ui/react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";

import { MdOutlineWaterDrop, MdWaterDrop } from "react-icons/md";
import { TbBottle } from "react-icons/tb";
import { AiOutlineEdit } from "react-icons/ai";

import { format } from "date-fns";
import Link from "next/link";

interface Registro {
  id: string;
  data: string;
  quantidade: number;
  perda_urina: boolean;
  necessidade_urina: boolean;
}

interface Bebida {
  id: string;
  data: string;
  quantidade: number;
  tipo: string;
}

interface PacienteRegistrosProps {
  registros: {
    id: string;
    idade: number;
    altura: number;
    peso: number;
    etnia: string;
    created_at: string;
    updated_at: string;
    usuario_id: string;
    fisioterapeuta_id: string;
    tipo_incontinencia: string;
    usuario: { nome: string };
    urinas: Registro[];
    bebidas: Bebida[];
  };
}

export default function Registros({ registros }: PacienteRegistrosProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  return (
    <>
      <Head>
        <title>Registros de Paciente | mic.day</title>
      </Head>
      <SidebarFisioterapeuta>
      <Flex direction="column" alignItems="center" justifyContent="center">
          <Flex
            maxW="1100px"
            direction={isMobile ? "column" : "row"}
            w="100%"
            align={isMobile ? "flex-start" : "center"}
            mb={isMobile ? 4 : 0}
          >
            <Link href="/fisioterapeuta/pacientes">
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
              Registros de {registros.usuario.nome}
            </Heading>
          </Flex>
          </Flex>

        <Flex flexDirection="column" align="center" p={2} >
          <Box textAlign="left" w="100%" maxW="1100">
            <Text fontWeight="semibold" fontSize="xl" mb={2} pl={1}>
              Registros de Urina
            </Text>
            <Box overflowX="auto" mb={4}>
            <TableContainer borderWidth={1} borderRadius={12}>
              <Table
                variant="striped"
              >
                <Thead>
                  <Tr>
                    <Th>Data / Hora</Th>
                    <Th>Quantidade</Th>
                    <Th>Perda de Urina</Th>
                    <Th>Urgência de Urinar</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {registros.urinas
                    .sort(
                      (a, b) =>
                        (new Date(b.data).getTime() || 0) -
                        (new Date(a.data).getTime() || 0)
                    )
                    .map((urina) => (
                      <Tr key={urina.id}>
                        <Td whiteSpace="nowrap">
                          {format(new Date(urina.data), "dd/MM/yyyy HH:mm")}
                        </Td>
                        <Td>{urina.quantidade}ml</Td>
                        <Td>{urina.perda_urina ? "Sim" : "Não"}</Td>
                        <Td>{urina.necessidade_urina ? "Sim" : "Não"}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
              </TableContainer>
            </Box>
          </Box>

          <Box textAlign="left" w="100%" maxW="1100">
            <Text fontWeight="semibold" fontSize="xl" mb={2} mt={2}pl={1}>
              Registros de Bebida
            </Text>
            <Box overflowX="auto">
            <TableContainer borderWidth={1} borderRadius={12}>
              <Table
                variant="striped"
              >
                <Thead>
                  <Tr>
                    <Th>Data / Hora</Th>
                    <Th>Quantidade</Th>
                    <Th>Tipo</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {registros.bebidas
                    .sort(
                      (a, b) =>
                        (new Date(b.data).getTime() || 0) -
                        (new Date(a.data).getTime() || 0)
                    )
                    .map((bebida) => (
                      <Tr key={bebida.id}>
                        <Td>
                          {format(new Date(bebida.data), "dd/MM/yyyy HH:mm")}
                        </Td>
                        <Td>{bebida.quantidade}ml</Td>
                        <Td>{bebida.tipo}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
              </TableContainer>
            </Box>
          </Box>
        </Flex>
      </SidebarFisioterapeuta>
    </>
  );
}

export const getServerSideProps = canSSRAuth("Fisioterapeuta", async (ctx) => {
  const { id } = ctx.params;

  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/registros/paciente", {
      params: {
        paciente_id: id,
      },
    });
    return {
      props: {
        registros: response.data,
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
