import { useState } from "react";

import Head from "next/head";
import Image from "next/image";
import Logo from "../../../../public/images/Logo.svg";
import Bg from "../../../../public/images/bg.svg";

import {
  Flex,
  Box,
  Text,
  InputGroup,
  Input,
  InputLeftElement,
  Button,
  useMediaQuery,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";

import { Icon } from "@chakra-ui/react";
import { HiOfficeBuilding, HiIdentification } from "react-icons/hi";

import { toast } from "react-toastify";

import { useRouter } from "next/router";

import { canSSRGuest } from "@/utils/canSSRGuest";
import { setupAPIClient } from "@/services/api";
import { TextoComLinks } from "@/components/modal/LinkModal";

export default function CadastroFisioterapeuta() {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const [imageDisplay] = useMediaQuery("(max-width: 750px)");

  const router = useRouter();
  const usuario_id = router.query.id;

  const [atuacao, setAtuacao] = useState("");
  const [crefito, setCrefito] = useState("");

  async function handleCadastro() {
    if (atuacao === "" || crefito === "") {
      toast.error("Preencha todos os campos");
      return;
    }

    if (crefito.length < 5 || crefito.length > 8) {
      toast.warning("Informe um código CREFITO válido!");
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/fisioterapeuta", {
        usuario_id: usuario_id,
        atuacao: atuacao,
        crefito: crefito,
      });

      toast.success("Cadastrado com sucesso!");
      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao cadastrar.");
    }
  }

  return (
    <>
      <Head>
        <title> Cadastro Fisioterapeuta | mic.day </title>
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
              Dados do Fisioterapeuta
            </Text>

            <FormControl isRequired>
              <FormLabel>Código CREFITO</FormLabel>
              <InputGroup size="lg">
                <InputLeftElement
                  children={
                    <Icon as={HiIdentification} color="gray.400" w={5} h={5} />
                  }
                />
                <Input
                  size="lg"
                  placeholder="00000-F"
                  _placeholder={{ color: "gray.400" }}
                  focusBorderColor="pink.600"
                  type="text"
                  mb={3}
                  value={crefito}
                  onChange={(e) => setCrefito(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Local de atuação</FormLabel>
              <InputGroup size="lg">
                <InputLeftElement
                  children={
                    <Icon as={HiOfficeBuilding} color="gray.400" w={5} h={5} />
                  }
                />
                <Input
                  size="lg"
                  placeholder="Seu local"
                  _placeholder={{ color: "gray.400" }}
                  focusBorderColor="pink.600"
                  type="text"
                  mb={4}
                  value={atuacao}
                  onChange={(e) => setAtuacao(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <TextoComLinks />

            <Button
              onClick={handleCadastro}
              background="pink.600"
              color="#FFF"
              size="lg"
              borderRadius={24}
              mb={7}
              _hover={{ bg: "pink.500" }}
            >
              Completar cadastro
            </Button>
          </Flex>
        </Flex>
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
