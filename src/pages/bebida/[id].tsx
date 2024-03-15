import { useState } from "react";
import Head from "next/head";
import {
  Flex,
  Text,
  Heading,
  Button,
  useMediaQuery,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
} from "@chakra-ui/react";
import { SidebarPaciente } from "@/components/sidebar/paciente";
import Link from "next/link";

import { FiChevronLeft } from "react-icons/fi";
import { Icon } from "@chakra-ui/react";
import { BsDropletHalf } from "react-icons/bs";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Router from "next/router";

import { toast } from "react-toastify";
import moment from "moment-timezone";
import { setupAPIClient } from "../../services/api";

interface BebidasProps {
  id: string;
  data: Date;
  tipo: string;
  quantidade: number;
  paciente_id: string;
}

interface EditBebidaProps {
  bebida: BebidasProps;
}

export default function EditBebida({ bebida }: EditBebidaProps) {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const [data, setData] = useState(
    moment(bebida?.data).tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm")
  );
  const [quantidade, setQuantidade] = useState(bebida?.quantidade);
  const [tipo, setTipo] = useState(bebida.tipo);

  async function handleEditarBebida() {
    if (data === "" || quantidade < 0 || tipo === "") {
      toast.warning("Dados inválidos");
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.put(`/paciente/bebida/${bebida.id}`, {
        data: data,
        tipo: tipo,
        quantidade: quantidade,
      });

      Router.push("/dashboard/paciente");
      toast.success("Registro atualizado com sucesso!");
    } catch (err) {
      console.log(err);
      toast.error("Erro ao editar Bebida.");
    }
  }

  return (
    <>
      <Head>
        <title>Editar registro de bebida | mic.day</title>
      </Head>
      <SidebarPaciente>
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
              Editar registro de bebida
            </Heading>
          </Flex>

          <Flex
            maxW="1100px"
            w="100%"
            align="center"
            justifyContent="center"
            mt={isMobile ? 2 : 4}
            pt={isMobile ? 4 : 8}
            pb={isMobile ? 4 : 8}
            direction="column"
            shadow="md"
            bg="pink.50"
            borderBottomColor="pink.700"
            borderBottomWidth={2}
          >
            <Flex justifyContent="flex-start" w="85%">
              <Text fontSize="lg" fontWeight="medium" mb={1}>
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
            />

            <Flex justifyContent="flex-start" w="85%" direction="column">
              <Text fontSize="lg" fontWeight="medium" mb={1}>
                Tipo de bebida
              </Text>
              <Select
                size="lg"
                focusBorderColor="pink.700"
                borderColor={"pink.700"}
                _hover={{ borderColor: "pink.700" }}
                placeholder="Selecione o tipo de bebida"
                mb={4}
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="Água">Água</option>
                <option value="Café">Café</option>
                <option value="Chá">Chá</option>
                <option value="Chimarrão">Chimarrão</option>
                <option value="Leite / laticínios">Leite / laticínios</option>
                <option value="Refrigerante">Refrigerante</option>
                <option value="Suco">Suco</option>
              </Select>
            </Flex>

            <Flex justifyContent="flex-start" w="85%">
              <Text fontSize="lg" fontWeight="medium" mb={1}>
                Quantidade (ml)
              </Text>
            </Flex>
            <Flex
              align="center"
              justifyContent="center"
              w="85%"
              flex-direction="column"
            >
              <InputGroup size="lg">
                <InputLeftElement
                  children={
                    <Icon as={BsDropletHalf} color="pink.700" w={5} h={5} />
                  }
                />
                <Input
                  placeholder="Ex: 325"
                  type="number"
                  focusBorderColor="pink.700"
                  borderColor={"pink.700"}
                  _hover={{ borderColor: "pink.700" }}
                  w="100%"
                  mb={6}
                  value={quantidade}
                  onChange={(e) => setQuantidade(parseFloat(e.target.value))}
                />
              </InputGroup>
            </Flex>

            <Button
              w="85%"
              size="lg"
              bg="pink.600"
              _hover={{ bg: "pink.500" }}
              color="#FFF"
              mb={2}
              onClick={handleEditarBebida}
            >
              Salvar
            </Button>
          </Flex>
        </Flex>
      </SidebarPaciente>
    </>
  );
}

export const getServerSideProps = canSSRAuth("Paciente", async (ctx) => {
  const { id } = ctx.params;

  try {
    const apiClient = setupAPIClient(ctx);
    const response = await apiClient.get("/bebida/id", {
      params: {
        bebida_id: id,
      },
    });

    return {
      props: {
        bebida: response.data,
      },
    };
  } catch (err) {
    console.log(err);

    return {
      redirect: {
        destination: "/dashboard/paciente",
        permanent: false,
      },
    };
  }
});
