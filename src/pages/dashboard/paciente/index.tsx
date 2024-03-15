import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

import {
  Flex,
  Text,
  Box,
  Heading,
  useMediaQuery,
  Button,
} from "@chakra-ui/react";

import { SidebarPaciente } from "../../../components/sidebar/paciente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";

import { MdOutlineWaterDrop, MdWaterDrop } from "react-icons/md";
import { TbBottle } from "react-icons/tb";
import { AiOutlineEdit } from "react-icons/ai";
import { MdReport } from "react-icons/md";

import { format } from "date-fns";

interface UrinasItem {
  id: string;
  data: Date;
  perda_urina: boolean;
  quantidade: number;
  necessidade_urina: boolean;
  paciente_id: string;
  tipoList: "urina";
}

interface BebidasItem {
  id: string;
  data: Date;
  tipo: string;
  quantidade: number;
  tipoList: "bebida";
}

interface PacienteProps {
  urinas: UrinasItem[];
  bebidas: BebidasItem[];
}

export default function DashboardPaciente({ urinas, bebidas }: PacienteProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const [urinasList, setUrinasList] = useState<UrinasItem[]>(urinas || []);
  const [bebidasList, setBebidasList] = useState<BebidasItem[]>(bebidas || []);

  const registros = [
    ...urinasList.map((urina) => ({ ...urina, tipoList: "urina" })),
    ...bebidasList.map((bebida) => ({ ...bebida, tipoList: "bebida" })),
  ];
  registros.sort(
    (a, b) =>
      (new Date(b.data).getTime() || 0) - (new Date(a.data).getTime() || 0)
  );

  const [filtro, setFiltro] = useState("todos");

  const filtrarRegistros = (tipoList) => {
    setFiltro(tipoList);
  };

  const registrosFiltrados =
    filtro === "todos"
      ? registros
      : registros.filter((registro) => registro.tipoList === filtro);

  return (
    <>
      <Head>
        <title>Página Inicial | mic.day </title>
      </Head>
      <SidebarPaciente>
        <Flex direction="column" alignItems="center" justifyContent="center">
          <Box p={4} w="100%" maxW="1100px">
            <Heading fontSize={"3xl"} mb={4} color="pink.700">
              Meus Registros
            </Heading>

            <Flex mb={5}>
              <Button
                mr={2}
                bg={filtro === "todos" ? "pink.400" : "pink.600"}
                color="white"
                _hover={{ bg: filtro === "todos" ? "pink.500" : "pink.500" }}
                onClick={() => filtrarRegistros("todos")}
              >
                Todos
              </Button>
              <Button
                mr={2}
                bg={filtro === "urina" ? "pink.400" : "pink.600"}
                color="white"
                _hover={{ bg: filtro === "urina" ? "pink.500" : "pink.500" }}
                onClick={() => filtrarRegistros("urina")}
              >
                Urina
              </Button>
              <Button
                bg={filtro === "bebida" ? "pink.400" : "pink.600"}
                color="white"
                _hover={{ bg: filtro === "bebida" ? "pink.500" : "pink.500" }}
                onClick={() => filtrarRegistros("bebida")}
              >
                Bebida
              </Button>
            </Flex>

            {registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((registro) => (
                <Box
                  key={registro.id}
                  shadow="md"
                  bg="pink.50"
                  borderBottomColor="pink.700"
                  borderBottomWidth={2}
                  mb={4}
                  p={4}
                >
                  <Flex alignItems="center" mb={2}>
                    {registro.tipoList === "urina" ? (
                      <Box
                        as={MdOutlineWaterDrop}
                        size={24}
                        color="#97266D"
                        mr={2}
                      />
                    ) : (
                      <Box as={TbBottle} size={24} color="#97266D" mr={2} />
                    )}
                    <Text
                      fontWeight="semibold"
                      fontSize={isMobile ? "md" : "lg"}
                    >
                      {registro.tipoList === "urina" ? "Urina" : "Bebida"}
                    </Text>
                  </Flex>
                  <Text
                    display="flex"
                    justifyContent="space-between"
                    fontSize={isMobile ? "md" : "lg"}
                  >
                    Quantidade: {registro.quantidade} ml | Data:{" "}
                    {format(new Date(registro.data), "dd/MM/yyyy HH:mm")}
                    <Link href={`/${registro.tipoList}/${registro.id}`}>
                      <Button
                        bg="pink.600"
                        color="white"
                        size="sm"
                        ml="auto"
                        _hover={{ bg: "pink.500" }}
                      >
                        <AiOutlineEdit size={16} />
                      </Button>
                    </Link>
                  </Text>
                </Box>
              ))
            ) : (
              <Flex direction="column" align="center" justify="center" mt={10}>
                <MdReport
                  size={isMobile ? 120 : 200}
                  color="RGBA(0, 0, 0, 0.24)"
                />
                <Text fontSize={isMobile ? "md" : "lg"} color="blackAlpha.600">
                  Não há dados para serem exibidos.
                </Text>
              </Flex>
            )}
          </Box>
        </Flex>
      </SidebarPaciente>
    </>
  );
}

export const getServerSideProps = canSSRAuth("Paciente", async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/urina/detalhes");
    const bebidasResponse = await apiClient.get("/bebida/detalhes");

    if (response.data === null || bebidasResponse.data === null) {
      return {
        redirect: {
          destination: "/dashboard/paciente",
          permanent: false,
        },
      };
    }
    return {
      props: {
        urinas: response.data,
        bebidas: bebidasResponse.data,
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
