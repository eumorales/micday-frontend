import { useState } from "react";
import { SidebarFisioterapeuta } from "@/components/sidebar/fisioterapeuta";
import Head from "next/head";
import {
  Text,
  Flex,
  Heading,
  Button,
  useMediaQuery,
  VStack,
  Box,
  Checkbox
} from "@chakra-ui/react";
import Link from "next/link";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { FiChevronLeft } from "react-icons/fi";
import { format } from "date-fns";

interface Orientacao {
  id: string;
  data: Date;
  paciente_id: string;
  descricao: string;
}

interface PacienteOrientacoesProps {
  orientacoes: {
    id: string;
    usuario: { nome: string };
    orientacoes: Orientacao[];
  };
}

export default function OrientacoesPacienteId({
  orientacoes,
}: PacienteOrientacoesProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");
  const [pacienteNome, setPacienteNome] = useState(orientacoes?.usuario.nome);

  return (
    <>
      <Head>
        <title>Orientações de Paciente | mic.day</title>
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
              Orientações de {pacienteNome}
            </Heading>
          </Flex>
          <VStack align="stretch" spacing={4} w="100%" maxW="1100px" mt={isMobile ? 0:2}>
            {orientacoes.orientacoes.map((orientacao) => (
              <Box
                key={orientacao.id}
                borderBottomWidth={2}
                fontSize="lg"
              >
                <Text borderTopWidth={2} borderBottomWidth={2} p={2}>
                {format(new Date(orientacao.data), "dd/MM/yyyy HH:mm")} | 
                  <strong> {pacienteNome} </strong>
                </Text>
                <Text p={2}>
                  <strong>Descrição</strong> 
                </Text>
                <Text p={2}>
                {orientacao.descricao}
                </Text>
                <Checkbox
                readOnly
                colorScheme="pink"
                size="md"
                borderColor="pink.600"
                p={2}
              >
                Recebida
              </Checkbox>
              </Box>
            ))}
          </VStack>
        </Flex>
      </SidebarFisioterapeuta>
    </>
  );
}

export const getServerSideProps = canSSRAuth("Fisioterapeuta", async (ctx) => {
  const { id } = ctx.params;

  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/orientacoes/paciente", {
      params: {
        paciente_id: id,
      },
    });
    return {
      props: {
        orientacoes: response.data,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: "/dashboard/fisioterapeuta",
        permanent: false,
      },
    };
  }
});
