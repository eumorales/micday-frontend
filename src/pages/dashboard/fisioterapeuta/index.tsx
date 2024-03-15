import { useState, useEffect } from "react";
import Head from "next/head";
import {
  Flex,
  Text,
  Heading,
  useMediaQuery,
  Button,
  Box,
} from "@chakra-ui/react";

import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { SidebarFisioterapeuta } from "../../../components/sidebar/fisioterapeuta";
import { MdOutlineWaterDrop } from "react-icons/md";
import { TbBottle } from "react-icons/tb";
import { MdReport } from "react-icons/md";

import { format, isToday, parseISO } from "date-fns";

interface PacienteItem {
  id: string;
  idade: number;
  altura: number;
  peso: number;
  etnia: string;
  usuario_id: string;
  fisioterapeuta_id: string;
  tipo_id: string;
  usuario: {
    nome: string;
  };
  urinas: UrinasItem[];
  bebidas: BebidasItem[];
}

interface UsuarioItem {
  nome: string;
}

interface UrinasItem {
  id: string;
  data: Date;
  perda_urina: boolean;
  quantidade: number;
  necessidade_urina: boolean;
  paciente_id: string;
  tipoList: "urina";
  nome: string;
}

interface BebidasItem {
  id: string;
  data: Date;
  tipo: string;
  quantidade: number;
  tipoList: "bebida";
  paciente_id: string;
  nome: string;
}

interface UsuarioProps {
  pacientes: PacienteItem[];
}

export default function DashboardFisioterapeuta({ pacientes }: UsuarioProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const [urinasList, setUrinasList] = useState<UrinasItem[]>([]);
  const [bebidasList, setBebidasList] = useState<BebidasItem[]>([]);

  const getNomePaciente = (registro: UrinasItem | BebidasItem) => {
    if (registro.tipoList === "urina") {
      const paciente = pacientes.find((p) => p.id === registro.paciente_id);
      return paciente?.usuario.nome || "";
    } else {
      const paciente = pacientes.find((p) => p.id === registro.paciente_id);
      return paciente?.usuario.nome || "";
    }
  };

  useEffect(() => {
    const listarUrinas: UrinasItem[] = pacientes.flatMap((paciente) =>
      paciente.urinas.map((urina) => ({
        id: urina.id,
        data: new Date(urina.data),
        perda_urina: urina.perda_urina,
        quantidade: urina.quantidade,
        necessidade_urina: urina.necessidade_urina,
        paciente_id: paciente.id,
        tipoList: "urina",
        nome: paciente.usuario.nome,
      }))
    );
    setUrinasList(listarUrinas);

    const listarBebidas: BebidasItem[] = pacientes.flatMap((paciente) =>
      paciente.bebidas.map((bebida) => ({
        id: bebida.id,
        data: new Date(bebida.data),
        tipo: bebida.tipo,
        quantidade: bebida.quantidade,
        tipoList: "bebida",
        paciente_id: paciente.id,
        nome: paciente.usuario.nome,
      }))
    );
    setBebidasList(listarBebidas);
  }, [pacientes]);

  
  const registros = [
    ...urinasList.map((urina) => ({ ...urina, tipoList: "urina" })),
    ...bebidasList.map((bebida) => ({ ...bebida, tipoList: "bebida" })),
  ];
  registros.sort((a, b) => {
    const aDate = new Date(a.data);
    const bDate = new Date(b.data);

    return (bDate.getTime() || 0) - (aDate.getTime() || 0);
  });

  const [filtro, setFiltro] = useState("todos");

  const filtrarRegistros = (tipoList: string) => {
    setFiltro(tipoList);
  };

  const registrosDoDia = registros.filter((registro) =>
    isToday(registro.data)
  );
  
  const registrosFiltrados =
  filtro === "todos" ? registrosDoDia : registrosDoDia.filter((registro) => registro.tipoList === filtro);

  return (
    <>
      <Head>
        <title>Página Inicial | mic.day</title>
      </Head>
      <SidebarFisioterapeuta>
        <Flex direction="column" alignItems="center" justifyContent="center">
          <Box p={4} w="100%" maxW="1100px">
            <Flex
              mt={2}
              maxW="1100px"
              direction={isMobile ? "column" : "row"}
              w="100%"
              justifyContent="flex-start"
              align={isMobile ? "flex-start" : "center"}
              mb={isMobile ? 4 : 6}
            >
              <Heading color="pink.700" fontSize={isMobile ? "28px" : "3xl"}>
                Últimos registros
              </Heading>
            </Flex>

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
              registrosFiltrados.map((registro) => {
                const urinaRegistro = registro as UrinasItem;
                const bebidaRegistro = registro as BebidasItem;

                return (
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
                        {registro.tipoList === "urina" ? "Urina" : "Bebida"} |{" "}
                        <strong>
                          {getNomePaciente(
                            registro as UrinasItem | BebidasItem
                          )}
                        </strong> - {" "}
                            {format(
                              new Date(registro.data),
                              "dd/MM/yyyy HH:mm"
                            )}
                      </Text>
                    </Flex>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="space-between"
                      fontSize={isMobile ? "md" : "lg"}
                    >
                      {registro.tipoList === "urina" && (
                        <>
                          <Text>
                             Quantidade: {registro.quantidade} ml 
                          </Text>
                          <Text>
                          Perda de
                            urina: {urinaRegistro.perda_urina ? "Sim" : "Não"}</Text>
                            <Text>
                            Necessidade urgente de urinar:{" "}
                            {urinaRegistro.necessidade_urina ? "Sim" : "Não"}
                            </Text>
                        </>
                      )}
                      {registro.tipoList === "bebida" && (
                        <>
                          Quantidade: {registro.quantidade} ml 
                          <Text>Tipo: {bebidaRegistro.tipo}</Text>
                        </>
                      )}
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Flex direction="column" align="center" justify="center" mt={10}>
                <MdReport
                  size={isMobile ? 120 : 200}
                  color="RGBA(0, 0, 0, 0.24)"
                />
                <Text fontSize={isMobile ? "md" : "lg"} color="blackAlpha.600">
                  Ainda não existem registros no dia de hoje
                </Text>
              </Flex>
            )}
          </Box>
        </Flex>
      </SidebarFisioterapeuta>
    </>
  );
}

export const getServerSideProps = canSSRAuth("Fisioterapeuta", async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/fisioterapeuta/pacientes");

    if (response.data === null) {
      return {
        redirect: {
          destination: "/dashboard/fisioterapeuta",
          permanent: false,
        },
      };
    }

    return {
      props: {
        pacientes: response.data,
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
