import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Box,
  Text,
  Input,
  Button,
  useToast,
  Flex,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import Image from "next/image";
import Logo from "../../../public/images/Logo.svg";
import { setupAPIClient } from "@/services/api";

const RedefinirSenha = () => {
  const router = useRouter();
  const toast = useToast();
  const { token } = router.query;
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const handleRedefinirSenha = async () => {
    if (novaSenha.length < 6) {
      toast({
        title: "Erro",
        description: "Sua senha precisar ter no mínimo 6 dígitos!",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não correspondem",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/nova-senha", {
        token,
        novaSenha,
      });

      toast({
        title: "Senha alterada",
        description: "Sua senha foi redefinida com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/");
    } catch (error) {
      console.error("Erro ao redefinir a senha:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao redefinir a senha",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Redefinir senha | mic.day</title>
      </Head>

      <Box
        maxW="md"
        mx="auto"
        mt={10}
        p={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Flex mb={8} justifyContent="center">
          <Image src={Logo} width={180} alt="Logo mic.day" />
        </Flex>
        <Text mb={6} fontSize={28} fontWeight="bold">
          Redefinir senha
        </Text>
        <Text mb={6}>
          Por favor introduza a sua nova senha duas vezes para que possamos
          verificar se introduziu corretamente.
        </Text>
        <FormControl isRequired>
          <FormLabel>Nova senha</FormLabel>
          <Input
            variant={"outline"}
            _placeholder={{ color: "gray.400" }}
            focusBorderColor="pink.500"
            type="password"
            placeholder="Nova Senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <FormHelperText mb={4}>
            Sua senha precisa ter no mínimo 6 dígitos.
          </FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Confirmar nova senha</FormLabel>
          <Input
            variant={"outline"}
            _placeholder={{ color: "gray.400" }}
            focusBorderColor="pink.500"
            type="password"
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            mb={8}
          />
        </FormControl>
        <Button onClick={handleRedefinirSenha} colorScheme="pink">
          Redefinir Senha
        </Button>
      </Box>
    </>
  );
};

export default RedefinirSenha;
