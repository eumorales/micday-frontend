import { useEffect, useState } from "react";
import Head from "next/head";
import {
  Select,
  Flex,
  useMediaQuery,
  Box,
  Button,
  Heading,
  FormLabel,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import { SidebarFisioterapeuta } from "@/components/sidebar/fisioterapeuta";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import RegistroFisio from "@/components/graficos/ChartFisioComponent";

export default function DadosFisioterapeuta({ pacientes }) {
  const [urinaRegistros, setUrinaRegistros] = useState([]);
  const [bebidaRegistros, setBebidaRegistros] = useState([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        if (pacienteSelecionado) {
          const apiClient = setupAPIClient();
          const response = await apiClient.get(
            `/registros/paciente/${pacienteSelecionado}`
          );

          const { urinas, bebidas } = response.data;

          setUrinaRegistros(urinas);
          setBebidaRegistros(bebidas);
        } else {
          setUrinaRegistros([]);
          setBebidaRegistros([]);
        }
      } catch (error) {
        console.error("Erro ao buscar registros:", error);
      }
    };

    fetchRegistros();
  }, [pacienteSelecionado]);

  const urinaDatas = urinaRegistros.map((registro) => {
    const date = new Date(registro.data);
    return date;
  });
  const urinaQuantidades = urinaRegistros.map(
    (registro) => registro.quantidade
  );

  const bebidaDatas = bebidaRegistros.map((registro) => {
    const date = new Date(registro.data);
    return date;
  });
  const bebidaQuantidades = bebidaRegistros.map(
    (registro) => registro.quantidade
  );

  const handlePacienteChange = (event) => {
    const opcaoSelecionada = event.target.value;
    setPacienteSelecionado(opcaoSelecionada);
  };

  return (
    <>
      <Head>
        <title>Análise de dados | mic.day</title>
      </Head>
      <SidebarFisioterapeuta>
        <Box maxWidth="1100px" margin="0 auto">
          <Flex
            pt={2}
            maxW="1100px"
            direction={isMobile ? "column" : "row"}
            w="100%"
            align={isMobile ? "flex-start" : "center"}
            mb={isMobile ? 4 : 4}
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
                mb={isMobile ? 4 : 0}
              >
                <FiChevronLeft size={24} color="#B83280" />
                Voltar
              </Button>
            </Link>
            <Heading
              color="pink.700"
              fontSize={{ base: "28px", md: "3xl" }}
              mb={isMobile ? 0 : 2}
            >
              Análise de dados
            </Heading>
          </Flex>
          <Box p={1} mb={2}>
            <FormLabel htmlFor="paciente-select">
              Selecionar paciente:
            </FormLabel>
            <Select
              _placeholder={{ color: "gray.400" }}
              focusBorderColor="pink.500"
              size="lg"
              w="100%"
              id="paciente-select"
              onChange={handlePacienteChange}
              placeholder="Selecione um paciente"
            >
              {pacientes.map((paciente) => (
                <option key={paciente.value} value={paciente.value}>
                  {paciente.label}
                </option>
              ))}
            </Select>
          </Box>
        </Box>
        {pacienteSelecionado && (
          <RegistroFisio
            urinaDatas={urinaDatas}
            urinaQuantidades={urinaQuantidades}
            bebidaDatas={bebidaDatas}
            bebidaQuantidades={bebidaQuantidades}
          />
        )}
      </SidebarFisioterapeuta>
    </>
  );
}

export const getServerSideProps = canSSRAuth("Fisioterapeuta", async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/fisioterapeuta/pacientes");
    const pacientes = response.data.map((paciente) => ({
      value: paciente.id,
      label: paciente.usuario.nome,
    }));
    return { props: { pacientes } };
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    return { props: { pacientes: [] } };
  }
});
