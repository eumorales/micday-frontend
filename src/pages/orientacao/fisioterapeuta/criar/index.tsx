import { useState, useEffect } from "react";
import Head from "next/head";
import { SidebarFisioterapeuta } from "@/components/sidebar/fisioterapeuta";

import {
  Flex,
  Text,
  Select,
  Heading,
  Button,
  Input,
  useMediaQuery,
  Textarea,
} from "@chakra-ui/react";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import moment from "moment-timezone";
import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import Router from "next/router";

interface PacienteItem {
  id: string;
  usuario: UsuarioProps;
}

interface UsuarioProps {
  nome: string;
}

interface PacienteProps {
  pacientes: PacienteItem[];
}

export default function CriarOrientacoes({ pacientes }: PacienteProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const [nome, setNome] = useState("");
  const [nomes, setNomes] = useState([]);
  const [nomeSelecionado, setNomeSelecionado] = useState(false);
  const [data, setData] = useState(
    moment().tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm")
  );
  const [descricao, setDescricao] = useState("");
  const [pacienteId, setPacienteId] = useState(pacientes[0]?.id);

  useEffect(() => {
    const nomes = pacientes.map((paciente) => paciente.usuario.nome);
    setNomes(nomes);
  }, [pacientes]);

  useEffect(() => {
    const pacienteSelecionado = pacientes.find(
      (paciente) => paciente.usuario.nome === nome
    );
    if (pacienteSelecionado) {
      setPacienteId(pacienteSelecionado.id);
    }
  }, [nome, pacientes]);

  async function handleOrientacoes() {
    if (descricao === "") {
      toast.warning("Informe a descrição.");
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/orientacoes", {
        paciente_id: pacienteId,
        data: new Date(data),
        descricao: descricao,
      });

      Router.push("/orientacao/fisioterapeuta/lista");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao salvar orientação.");
    }
  }

  return (
    <>
      <Head>
        <title>Criar Orientações | mic.day</title>
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
              Criar orientação
            </Heading>
          </Flex>

          <Flex
            maxW="1100px"
            w="100%"
            align="center"
            justifyContent="center"
            mt={isMobile ? 0 : 4}
            pt={8}
            pb={8}
            direction="column"
            shadow="md"
            bg="pink.50"
            borderBottomColor="pink.700"
            borderBottomWidth={2}
          >
            <Flex justifyContent="flex-start" w="85%" direction="column">
              <Text
                fontSize={isMobile ? "md" : "lg"}
                mb={2}
                fontWeight="medium"
              >
                Paciente
              </Text>
            </Flex>
            <Select
              size="lg"
              fontSize={isMobile ? "md" : "lg"}
              w="85%"
              focusBorderColor="pink.700"
              borderColor={"pink.700"}
              _hover={{ borderColor: "pink.700" }}
              placeholder="Selecione o paciente"
              mb={4}
              value={nome}
              onChange={(e) => {
                const pacienteSelecionado = pacientes.find(
                  (paciente) => paciente.usuario.nome === e.target.value
                );
                setNome(e.target.value);
                setNomeSelecionado(Boolean(e.target.value));
                setPacienteId(pacienteSelecionado?.id);
              }}
            >
              {nomes.map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
            </Select>

            <Flex justifyContent="flex-start" w="85%">
              <Text
                fontSize={isMobile ? "md" : "lg"}
                mb={1}
                fontWeight="medium"
              >
                Data / Hora
              </Text>
            </Flex>
            <Input
              placeholder="Data e Hora"
              size="lg"
              type="datetime-local"
              focusBorderColor="pink.700"
              borderColor={"pink.700"}
              _hover={{ borderColor: "pink.700" }}
              w="85%"
              mb={4}
              defaultValue={data}
              onChange={(e) => setData(e.target.value)}
              fontSize={isMobile ? "md" : "lg"}
            />

            <Flex justifyContent="flex-start" w="85%">
              <Text
                fontSize={isMobile ? "md" : "lg"}
                mb={1}
                fontWeight="medium"
              >
                Descrição:{" "}
              </Text>
            </Flex>

            <Textarea
              focusBorderColor="pink.700"
              _hover={{ borderColor: "pink.700" }}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Informe a orientação que deseja enviar ao paciente.."
              size="lg"
              borderColor={"pink.700"}
              w="85%"
              mb={6}
              fontSize={isMobile ? "md" : "lg"}
              h={isMobile ? "150" : "200"}
            />

            <Flex justifyContent="center" w="85%">
              <Button
                mt={3}
                mr={4}
                bg="pink.600"
                color="white"
                size="lg"
                _hover={{ bg: "pink.500" }}
                isDisabled={!nomeSelecionado}
                onClick={handleOrientacoes}
                fontSize={isMobile ? "md" : "lg"}
                w="50%"
              >
                Salvar
              </Button>
            </Flex>
          </Flex>
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
