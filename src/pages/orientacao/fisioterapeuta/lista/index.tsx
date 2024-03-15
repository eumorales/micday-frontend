import { useState } from "react";
import Head from "next/head";
import { SidebarFisioterapeuta } from "@/components/sidebar/fisioterapeuta";
import {
  Text,
  Input,
  useMediaQuery,
  Button,
  Heading,
  Flex,
  Box,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  Checkbox,
} from "@chakra-ui/react";
import Link from "next/link";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { FiChevronLeft } from "react-icons/fi";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { format } from "date-fns";
import moment from "moment-timezone";
import { toast } from "react-toastify";
import Router from "next/router";

interface OrientacaoItem {
  id: string;
  descricao: string;
  data: Date;
  status: boolean;
  paciente: {
    id: string;
    usuario: {
      nome: string;
    };
  };
}

interface OrientacaoListProps {
  orientacoes: OrientacaoItem[];
}

export default function OrientacoesFisioterapeuta({
  orientacoes,
}: OrientacaoListProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [orientacaoSelecionada, setOrientacaoSelecionada] = useState(null);

  const orientacoesOrdenadas = orientacoes.sort((a, b) => {
    const dataA = new Date(a.data).getTime();
    const dataB = new Date(b.data).getTime();
    return dataB - dataA;
  });

  const pacientes = orientacoes.map((orientacao) => orientacao.paciente);
  const pacientesUnicos = pacientes.reduce((unicos, pacienteAtual) => {
    if (unicos.findIndex((pac) => pac.id === pacienteAtual.id) === -1) {
      return [...unicos, pacienteAtual];
    }
    return unicos;
  }, []);

  const handleOpenModal = (orientacao) => {
    setOrientacaoSelecionada(orientacao);
    onOpen();
  };

  const handleOpenDeleteModal = (orientacao: OrientacaoItem) => {
    setOrientacaoSelecionada(orientacao);
    setIsDeleteModalOpen(true);
  };

  async function handleDelete(orientacao) {
    try {
      const apiClient = setupAPIClient();
      await apiClient.delete(`/orientacoes/${orientacao.id}`, {
        params: { orientacao_id: orientacao.id },
      });

      onCloseDeleteModal();
      Router.push("/orientacao/fisioterapeuta/lista");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao excluir orientação.");
    }
  }

  async function handleEdit() {
    try {
      const { id, descricao, data, paciente } = orientacaoSelecionada;
      const dataFormatada = moment(data)
        .tz("America/Sao_Paulo")
        .format("YYYY-MM-DDTHH:mm");
      const apiClient = setupAPIClient();
      await apiClient.put(`/orientacoes/${id}`, {
        descricao: descricao,
        data: dataFormatada,
        paciente_id: paciente.id,
      });
      onClose();
      Router.push("/orientacao/fisioterapeuta/lista");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao atualizar orientação.");
    }
  }

  const onCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <Head>Minhas Orientações | mic.day</Head>
      <SidebarFisioterapeuta>
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
              Minhas orientações
            </Heading>
          </Flex>

          <VStack align="stretch" spacing={4} w="100%" maxW="1100px">
            {orientacoesOrdenadas.map((orientacao) => (
              <Box
                key={orientacao.id}
                mt={isMobile ? 0 : 4}
                borderBottomWidth={2}
                fontSize="lg"
              >
                <Text borderTopWidth={2} borderBottomWidth={2} p={2}>
                  {format(new Date(orientacao.data), "dd/MM/yyyy HH:mm")} |
                  Para:
                  <strong> {orientacao.paciente.usuario.nome} </strong>
                </Text>
                <Text p={2}>
                  <strong>Descrição</strong>
                </Text>
                <Text pl={2}>{orientacao.descricao}</Text>
                <Checkbox
                  isReadOnly
                  colorScheme="pink"
                  size="md"
                  borderColor="pink.600"
                  p={2}
                  defaultChecked={orientacao.status}
                >
                  Lida pelo paciente
                </Checkbox>
                <Box mt={2} mb={2} color="white" pl={2}>
                  <Button
                    bg="pink.600"
                    _hover={{ bg: "pink.500" }}
                    size="sm"
                    mr={3}
                    leftIcon={<FaRegEdit />}
                    onClick={() => handleOpenModal(orientacao)}
                    color="white"
                  >
                    Editar
                  </Button>
                  <Button
                    bg="gray.400"
                    _hover={{ bg: "gray.300" }}
                    size="sm"
                    leftIcon={<FaRegTrashAlt />}
                    onClick={() => handleOpenDeleteModal(orientacao)}
                  >
                    Excluir
                  </Button>
                </Box>
              </Box>
            ))}
          </VStack>

          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Editar Orientação</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl id="paciente" mb={3}>
                  <FormLabel>Paciente</FormLabel>
                  <Select
                    size="lg"
                    focusBorderColor="pink.700"
                    borderColor={"pink.700"}
                    _hover={{ borderColor: "pink.600" }}
                    onChange={(e) =>
                      setOrientacaoSelecionada({
                        ...orientacaoSelecionada,
                        paciente: pacientesUnicos.find(
                          (pac) => pac.id === e.target.value
                        ),
                      })
                    }
                  >
                    {pacientesUnicos.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.usuario.nome}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl id="dataHora" mb={3}>
                  <FormLabel>Data / Hora</FormLabel>
                  {orientacaoSelecionada && (
                    <Input
                      value={format(
                        new Date(orientacaoSelecionada.data),
                        "yyyy-MM-dd'T'HH:mm"
                      )}
                      placeholder="Data e Hora"
                      size="lg"
                      type="datetime-local"
                      focusBorderColor="pink.700"
                      borderColor={"pink.700"}
                      _hover={{ borderColor: "pink.700" }}
                      onChange={(e) =>
                        setOrientacaoSelecionada({
                          ...orientacaoSelecionada,
                          data: e.target.value,
                        })
                      }
                    />
                  )}
                </FormControl>
                <FormControl id="descricao">
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    focusBorderColor="pink.700"
                    _hover={{ borderColor: "pink.700" }}
                    placeholder="Informe a orientação que deseja enviar ao paciente.."
                    size="lg"
                    borderColor={"pink.700"}
                    value={orientacaoSelecionada?.descricao ?? ""}
                    onChange={(e) =>
                      setOrientacaoSelecionada({
                        ...orientacaoSelecionada,
                        descricao: e.target.value,
                      })
                    }
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="ghost"
                  mr={3}
                  onClick={onClose}
                  _hover={{ bg: "pink.50" }}
                >
                  Cancelar
                </Button>
                <Button
                  bg="pink.600"
                  color="white"
                  _hover={{ bg: "pink.500" }}
                  onClick={() => handleEdit()}
                >
                  Salvar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={isDeleteModalOpen}
            onClose={onCloseDeleteModal}
            size="sm"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Excluir orientação</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>Você tem certeza de que deseja excluir a orientação?</Text>
              </ModalBody>
              <ModalFooter>
                <Button mr={2} size="sm" onClick={onCloseDeleteModal} colorScheme="gray">
                  Cancelar
                </Button>
                <Button size="sm"
                  colorScheme="pink"
                  onClick={() => handleDelete(orientacaoSelecionada!)}
                >
                  Confirmar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </SidebarFisioterapeuta>
    </>
  );
}

export const getServerSideProps = canSSRAuth("Fisioterapeuta", async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/orientacoes");

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
        orientacoes: response.data,
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
