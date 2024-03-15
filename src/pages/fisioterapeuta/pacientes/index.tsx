import { useState, ChangeEvent, useEffect } from "react";
import Head from "next/head";
import {
  Flex,
  Text,
  Heading,
  useMediaQuery,
  Button,
  Stack,
  Switch,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  VStack,
  Tooltip,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { SidebarFisioterapeuta } from "../../../components/sidebar/fisioterapeuta";

import Link from "next/link";
import Router from "next/router";
import { Icon } from "@chakra-ui/react";

import { FiChevronLeft } from "react-icons/fi";
import { BsPersonFill, BsCheckCircle } from "react-icons/bs";
import { AiOutlineFileSearch, AiOutlineSearch } from "react-icons/ai";
import { FaRegBell } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";

export interface PacienteItem {
  id: string;
  idade: number;
  peso: number;
  altura: number;
  etnia: string;
  created_at: string;
  usuario_id: string;
  tipo_incontinencia: string;
  status: boolean;
  fisioterapeuta_id: string;
  usuario: UsuarioProps;
}

export interface UsuarioProps {
  email: string;
  nome: string;
  cpf: string;
  telefone: string;
}

export interface PacienteProps {
  pacientes: PacienteItem[];
}

export default function MeusPacientes({ pacientes }: PacienteProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const [statusPaciente, setStatusPaciente] = useState("enabled");
  const [filtroNome, setFiltroNome] = useState("");
  const [pacientesFiltrados, setPacientesFiltrados] = useState(pacientes);
  const [selectedPaciente, setSelectedPaciente] = useState<PacienteItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const filtrarPacientes = () => {
      let pacientesFiltrados = pacientes;

      if (statusPaciente === "enabled") {
        pacientesFiltrados = pacientesFiltrados.filter(
          (paciente) => paciente.status === true
        );
      } else {
        pacientesFiltrados = pacientesFiltrados.filter(
          (paciente) => paciente.status === false
        );
      }

      pacientesFiltrados = pacientesFiltrados.filter((paciente) =>
        paciente.usuario.nome.toLowerCase().includes(filtroNome.toLowerCase())
      );

      setPacientesFiltrados(pacientesFiltrados);
    };

    filtrarPacientes();
  }, [statusPaciente, filtroNome]);

  async function handleStatus(e: ChangeEvent<HTMLInputElement>) {
    setStatusPaciente(statusPaciente === "enabled" ? "disabled" : "enabled");
  }

  async function handleStatusChange(pacienteId: string, novoStatus: boolean) {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.put(`/paciente/status/${pacienteId}`, {
        status: novoStatus,
      });

      const pacientesAtualizados = pacientes.map((paciente) => {
        if (paciente.id === pacienteId) {
          return {
            ...paciente,
            status: novoStatus,
          };
        }
        return paciente;
      });

      Router.push("/fisioterapeuta/pacientes");
      setPacientesFiltrados(pacientesAtualizados);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleButtonClick(pacienteId: string, status: boolean) {
    const novoStatus = !status;
    handleStatusChange(pacienteId, novoStatus);
  }

  function handleOpenModal(paciente: PacienteItem) {
    setSelectedPaciente(paciente);
    setIsModalOpen(true);
  }

  return (
    <>
      <Head>
        <title>Meus Pacientes | mic.day</title>
      </Head>
      <SidebarFisioterapeuta>
        <Flex direction="column" alignItems="center" justifyContent="center">
          <Flex
            maxW="1100px"
            direction={isMobile ? "column" : "row"}
            w="100%"
            align={isMobile ? "flex-start" : "center"}
            justify={isMobile ? "flex-start" : "space-between"}
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
              mb={isMobile ? 2 : 4}
              fontSize={isMobile ? "28px" : "3xl"}
            >
              Meus pacientes
            </Heading>

            <Stack
              ml={isMobile ? 0 : "auto"}
              mt={isMobile ? 2 : 0}
              align="center"
              direction="row"
              pr={2}
            >
              <Text fontWeight="bold" pr={1}>
                ATIVOS
              </Text>
              <Switch
                colorScheme="pink"
                size="lg"
                value={statusPaciente}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleStatus(e)}
                isChecked={statusPaciente === "disabled" ? false : true}
              />
            </Stack>
          </Flex>

          <VStack align="stretch" spacing={4} w="100%" maxW="1100px">
            <InputGroup size="lg" mt={isMobile ? 0 : 4} mb={isMobile ? 0 : 4}>
              <InputLeftElement
                pointerEvents="none"
                children={
                  <Icon as={AiOutlineSearch} color="gray.400" w={5} h={5} />
                }
              />
              <Input
                focusBorderColor="pink.500"
                placeholder="Buscar paciente"
                value={filtroNome}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFiltroNome(e.target.value)
                }
              />
            </InputGroup>
            <TableContainer borderWidth={1} borderRadius={12}>
              <Table variant="striped">
                <Thead>
                  <Tr>
                    <Th>Nome</Th>
                    <Th>Idade</Th>
                    <Th>Tipo de IU</Th>
                    <Th>Status</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pacientesFiltrados.map((paciente) => (
                    <Tr key={paciente.id}>
                      <Td>{paciente.usuario.nome}</Td>
                      <Td>{paciente.idade}</Td>
                      <Td>{paciente.tipo_incontinencia}</Td>
                      <Td>{paciente.status === true ? "Ativo" : "Inativo"}</Td>
                      <Td>
                        <Tooltip label="Perfil" placement="top">
                          <Button
                            variant="unstyled"
                            leftIcon={<BsPersonFill size={18} />}
                            color="pink.600"
                            size="sm"
                            isDisabled={paciente.status === false}
                            onClick={() => handleOpenModal(paciente)}
                          />
                        </Tooltip>

                        <Tooltip label="Registros" placement="top">
                          <Link href={`/registros/paciente/${paciente.id}`}>
                            <Button
                              variant="unstyled"
                              leftIcon={<AiOutlineFileSearch size={18} />}
                              color="pink.600"
                              size="sm"
                              isDisabled={paciente.status === false}
                            />
                          </Link>
                        </Tooltip>

                        <Tooltip label="Orientações" placement="top">
                          <Link
                            href={`/orientacao/fisioterapeuta/paciente/${paciente.id}`}
                          >
                            <Button
                              variant="unstyled"
                              leftIcon={<FaRegBell size={18} />}
                              color={"pink.600"}
                              size="sm"
                              isDisabled={paciente.status === false}
                            />
                          </Link>
                        </Tooltip>

                        <Tooltip
                          label={
                            paciente.status === true ? "Desativar" : "Ativar"
                          }
                          placement="top"
                        >
                          <Button
                            variant="unstyled"
                            leftIcon={
                              paciente.status === true ? (
                                <MdDeleteForever size={20} />
                              ) : (
                                <BsCheckCircle size={16} />
                              )
                            }
                            color={
                              paciente.status === true ? "red.500" : "green.500"
                            }
                            size="sm"
                            onClick={() =>
                              handleButtonClick(paciente.id, paciente.status)
                            }
                          />
                        </Tooltip>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
          {isModalOpen && selectedPaciente && (
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Visualizar paciente</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Flex>
                    <Flex direction="column" p={2}>
                      <Text mb={2} fontSize={isMobile ? "md" : "lg"}>
                        <strong>NOME </strong>
                        <Text>{selectedPaciente.usuario.nome}</Text>
                      </Text>
                      <Text mb={2} fontSize={isMobile ? "md" : "lg"}>
                        <strong>EMAIL </strong>
                        <Text>{selectedPaciente.usuario.email}</Text>
                      </Text>
                      <Text mb={2} fontSize={isMobile ? "md" : "lg"}>
                        <strong>CPF </strong>
                        <Text>{selectedPaciente.usuario.cpf}</Text>
                      </Text>
                      <Text mb={2} fontSize={isMobile ? "md" : "lg"}>
                        <strong>CELULAR </strong>
                        <Text>{selectedPaciente.usuario.telefone}</Text>
                      </Text>
                      <Text mb={2} fontSize={isMobile ? "md" : "lg"}>
                        <strong>TIPO DE IU </strong>
                        <Text>{selectedPaciente.tipo_incontinencia}</Text>
                      </Text>
                    </Flex>
                    <Flex direction="column" p={2}>
                      <Text mb={2} fontSize={isMobile ? "md" : "lg"}>
                        <strong>ETNIA </strong>
                        <Text>{selectedPaciente.etnia}</Text>
                      </Text>
                      <Text mb={2} fontSize={isMobile ? "md" : "lg"}>
                        <strong>IDADE </strong>
                        <Text>{selectedPaciente.idade} anos</Text>
                      </Text>
                      <Text mb={2} fontSize={isMobile ? "md" : "lg"}>
                        <strong>ALTURA </strong>
                        <Text>{selectedPaciente.altura} m</Text>
                      </Text>
                      <Text mb={2} fontSize={isMobile ? "md" : "lg"}>
                        <strong>PESO </strong>
                        <Text>{selectedPaciente.peso} kg</Text>
                      </Text>
                    </Flex>
                  </Flex>
                </ModalBody>
              </ModalContent>
            </Modal>
          )}
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
