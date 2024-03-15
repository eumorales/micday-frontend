import { useState, useEffect } from "react";

import Head from "next/head";
import Image from "next/image";
import Logo from "../../../../public/images/logo.svg";
import Bg from "../../../../public/images/bg.svg";

import {
  Flex,
  Box,
  Text,
  Input,
  Button,
  Select,
  InputGroup,
  InputLeftElement,
  useMediaQuery,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import { Icon } from "@chakra-ui/react";
import { HiIdentification } from "react-icons/hi";
import { GiBodyHeight } from "react-icons/gi";
import { BiBody } from "react-icons/bi";

import { toast } from "react-toastify";

import { useRouter } from "next/router";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { setupAPIClient } from "@/services/api";
import { TextoComLinks } from "@/components/modal/LinkModal";

export default function CadastroPaciente() {
  const [imageDisplay] = useMediaQuery("(max-width: 750px)");

  const router = useRouter();
  const usuario_id = router.query.id;

  const [idade, setIdade] = useState("");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [etnia, setEtnia] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [fisioterapeutas, setFisioterapeutas] = useState([]);
  const [fisioterapeutaSelecionado, setFisioterapeutaSelecionado] =
    useState("");
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  useEffect(() => {
    async function fetchFisioterapeutas() {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/fisioterapeutas");
      setFisioterapeutas(response.data);
    }
    fetchFisioterapeutas();
  }, []);

  const openConfirmationModal = () => {
    setIsConfirmationOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
  };

  async function realizarCadastro() {
    if (
      idade === "" ||
      altura === "" ||
      peso === "" ||
      etnia === "" ||
      tipoSelecionado === "" ||
      fisioterapeutaSelecionado === ""
    ) {
      toast.error("Preencha todos os campos.");
      setIsConfirmationOpen(false);
      return;
    }

    if (+idade > 110) {
      toast.warning("Informe uma idade válida.");
      setIsConfirmationOpen(false);
      return;
    }

    if (+altura > 2.3) {
      toast.warning("Informe uma altura válida. Exemplo: 1.65");
      setIsConfirmationOpen(false);
      return;
    }

    if (+peso < 10 || +peso > 180) {
      toast.warning("Informe um peso válido em kg. Exemplo: 75.5");
      setIsConfirmationOpen(false);
      return;
    }

    openConfirmationModal();

    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/paciente", {
        idade: Number(idade),
        altura: Number(altura),
        peso: Number(peso),
        etnia: etnia,
        usuario_id: usuario_id,
        fisioterapeuta_id: fisioterapeutaSelecionado,
        tipo_incontinencia: tipoSelecionado,
      });

      toast.success("Cadastrado com sucesso!!");
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao cadastrar.");
    }
  }

  return (
    <>
      <Head>
        <title> Cadastro Paciente | mic.day </title>
      </Head>
      <Flex direction={["column", "row"]} height="100vh">
        <Flex
          width={["100%", "65%"]}
          flexGrow="1"
          justifyContent="center"
          alignItems="center"
        >
          <Flex width={640} direction="column" p={14} rounded={8}>
            <Flex mb={5}>
              <Image src={Logo} quality={100} width={120} alt="Logo mic.day" />
            </Flex>

            <Text mb={4} fontSize={24} fontWeight="bold">
              Dados do Paciente
            </Text>

            <FormControl isRequired>
              <FormLabel>Idade</FormLabel>
              <InputGroup size="lg">
                <InputLeftElement
                  children={
                    <Icon as={HiIdentification} color="gray.400" w={5} h={5} />
                  }
                />
                <Input
                  size="lg"
                  placeholder="35 anos"
                  _placeholder={{ color: "gray.400" }}
                  focusBorderColor="pink.600"
                  type="number"
                  mb={3}
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Altura (m)</FormLabel>
              <InputGroup size="lg">
                <InputLeftElement
                  children={<Icon as={GiBodyHeight} color="gray.400" />}
                />
                <Input
                  size="lg"
                  placeholder="1.57 m"
                  _placeholder={{ color: "gray.400" }}
                  focusBorderColor="pink.600"
                  type="number"
                  mb={3}
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Peso (kg)</FormLabel>
              <InputGroup size="lg">
                <InputLeftElement
                  children={<Icon as={BiBody} color="gray.400" w={5} h={5} />}
                />
                <Input
                  size="lg"
                  placeholder="52.5 kg"
                  _placeholder={{ color: "gray.400" }}
                  focusBorderColor="pink.600"
                  type="number"
                  mb={3}
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Etnia</FormLabel>
              <Select
                size="lg"
                focusBorderColor="pink.600"
                placeholder="Selecione"
                mb={3}
                value={etnia}
                onChange={(e) => setEtnia(e.target.value)}
              >
                <option value="Branca">Branca</option>
                <option value="Preta">Preta</option>
                <option value="Parda">Parda</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Tipo de incontinência urinária </FormLabel>
              <Select
                size="lg"
                focusBorderColor="pink.600"
                placeholder="Selecione"
                mb={3}
                value={tipoSelecionado}
                onChange={(e) => setTipoSelecionado(e.target.value)}
              >
                <option value="Incontinência Urinária de Esforço">
                  Incontinência Urinária de Esforço
                </option>
                <option value="Incontinência Urinária de Urgência">
                  Incontinência Urinária de Urgência
                </option>
                <option value="Incontinência Urinária Mista">Incontinência Urinária Mista</option>
                <option value="Incontinência Urinária Funcionall">
                  Incontinência Urinária Funcional
                </option>
                <option value="Incontinência Urinária de Transbordamento">
                  Incontinência Urinária de Transbordamento
                </option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Fisioterapeuta Responsável </FormLabel>
              <Select
                size="lg"
                focusBorderColor="pink.600"
                placeholder="Selecione"
                mb={4}
                value={fisioterapeutaSelecionado}
                onChange={(e) => setFisioterapeutaSelecionado(e.target.value)}
              >
                {fisioterapeutas.map((fisioterapeuta) => (
                  <option key={fisioterapeuta.id} value={fisioterapeuta.id}>
                    {fisioterapeuta.usuario.nome}
                  </option>
                ))}
              </Select>
            </FormControl>

            <TextoComLinks />

            <Button
              onClick={openConfirmationModal}
              background="pink.600"
              color="#FFF"
              size="lg"
              borderRadius={24}
              _hover={{ bg: "pink.500" }}
            >
              Completar cadastro
            </Button>
          </Flex>
        </Flex>

        <Modal isOpen={isConfirmationOpen} onClose={closeConfirmationModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmação do Fisioterapeuta</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={4}>
                Por favor, confirme que esse é o seu fisioterapeuta responsável
                para completar o cadastro:
              </Text>
              <Text>
                <strong>Nome do Fisioterapeuta:</strong>{" "}
                {fisioterapeutas
                  .find(
                    (fisioterapeuta) =>
                      fisioterapeuta.id === fisioterapeutaSelecionado
                  )
                  ?.usuario.nome.toUpperCase() || ""}
              </Text>
              <Text mt={2}>
                <strong>Local de atuação:</strong>{" "}
                {fisioterapeutas
                  .find(
                    (fisioterapeuta) =>
                      fisioterapeuta.id === fisioterapeutaSelecionado
                  )
                  ?.atuacao.toUpperCase() || ""}
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="gray"
                mr={3}
                onClick={closeConfirmationModal}
              >
                Cancelar
              </Button>
              <Button colorScheme="green" onClick={realizarCadastro}>
                Confirmar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Box
          bg="pink.600"
          style={{ filter: "saturate(130%)" }}
          display={imageDisplay ? "none" : "block"}
          overflow="hidden"
          position="relative"
          maxW="550px"
          width="100%"
        >
          <Image
            src={Bg}
            alt="Black and white image"
            layout="fill"
            objectFit="cover"
          />
        </Box>
      </Flex>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
