import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  useToast,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import Logo from "../../../../public/images/Logo.svg";
import { setupAPIClient } from "@/services/api";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { SidebarFisioterapeuta } from "@/components/sidebar/fisioterapeuta";

export default function AlterarSenha({ fisioterapeuta }) {
  const toast = useToast();
  const router = useRouter();
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [fisioterapeutaId, setFisioterapeutaId] = useState(
    fisioterapeuta.usuario.id
  );

  const handleRedefinirSenha = async () => {
    if (novaSenha === senhaAtual) {
      toast({
        title: "Erro",
        description: "Sua nova senha precisa ser diferente da antiga",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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
      await apiClient.put("/trocar-senha", {
        usuario_id: fisioterapeutaId,
        senha_atual: senhaAtual,
        nova_senha: novaSenha,
      });

      toast({
        title: "Senha alterada",
        description: "Sua senha foi redefinida com sucesso",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/dashboard/fisioterapeuta");
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
        <title>Alterar senha | mic.day</title>
      </Head>
      <SidebarFisioterapeuta>
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
          <Text mb={4} fontSize={28} fontWeight="bold">
            Alterar senha
          </Text>
          <Text mb={6}>
            Por razões de segurança, por favor introduza a sua palavra-passe
            antiga e depois introduza a nova duas vezes para que possamos
            verificar se introduziu corretamente.
          </Text>
          <FormControl isRequired>
            <FormLabel>Senha atual</FormLabel>
            <Input
              variant={"outline"}
              _placeholder={{ color: "gray.400" }}
              focusBorderColor="pink.500"
              type="password"
              placeholder="Nova Senha"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              mb={4}
            />
          </FormControl>
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
            Alterar Senha
          </Button>
        </Box>
      </SidebarFisioterapeuta>
    </>
  );
}

export const getServerSideProps = canSSRAuth("Fisioterapeuta", async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/detalhes");

    return {
      props: {
        fisioterapeuta: response.data,
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
