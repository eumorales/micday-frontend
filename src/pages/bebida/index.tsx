import { useState } from "react";
import Head from "next/head";
import { SidebarPaciente } from "../../components/sidebar/paciente";

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
  ListItem,
  OrderedList,
} from "@chakra-ui/react";

import { Icon } from "@chakra-ui/react";
import { BsDropletHalf } from "react-icons/bs";

import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi";
import { toast } from "react-toastify";
import { setupAPIClient } from "@/services/api";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Router from "next/router";
import moment from "moment-timezone";

export default function Bebida() {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const [data, setData] = useState(
    moment().tz("America/Sao_Paulo").format("YYYY-MM-DDTHH:mm")
  );
  const [quantidade, setQuantidade] = useState("");
  const [tipo, setTipo] = useState("");
  const [necessidade, setNecessidade] = useState<boolean>(false);

  async function handleBebida() {
    if (quantidade === "") {
      toast.warning("Dados inválidos!");
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/bebida", {
        data: new Date(data),
        tipo: tipo,
        quantidade: Number(quantidade),
      });

      toast.success("Registrado com sucesso!");
      Router.push("/dashboard/paciente");
    } catch (err) {
      toast.error("Erro ao registrar bebida.");
    }
  }

  return (
    <>
      <Head>
        <title>Registro de Bebida | mic.day</title>
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
              Registrar bebida
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
              <Text fontSize="lg" mb={1} fontWeight="medium">
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
              <Text fontSize="lg" mb={1} fontWeight="medium">
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
                  onChange={(e) => setQuantidade(e.target.value)}
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
              onClick={handleBebida}
            >
              Salvar
            </Button>
          </Flex>
          <Flex
            maxW="1100px"
            w="100%"
            align="center"
            pl={isMobile ? 4 : 4}
            mt={5}
            justifyContent="center"
            direction="column"
          >
            <Text
              fontSize="lg"
              mb={3}
              fontWeight="medium"
              alignSelf="flex-start"
            >
              Dicas
            </Text>
            <OrderedList>
              <ListItem mb={2}>
                Beba água com moderação antes de dormir. Isso pode ajudar a
                reduzir a necessidade de urinar durante a noite.
              </ListItem>
              <ListItem mb={2}>
                Mantenha um diário alimentar. Alguns alimentos, como bebidas com
                cafeína ou alimentos ricos em açúcar, podem aumentar a
                probabilidade de incontinência urinária.
              </ListItem>
              <ListItem mb={2}>
                Realize exercícios de fortalecimento do assoalho pélvico. Esses
                exercícios podem ajudar a melhorar o controle da bexiga e
                reduzir a incontinência urinária.
              </ListItem>
              <ListItem mb={2}>
                Considere o uso de produtos de higiene pessoal adequados. Usar
                produtos adequados para a higiene pessoal pode ajudar a evitar
                irritações e infecções que podem contribuir para a incontinência
                urinária.
              </ListItem>
              <ListItem mb={2}>
                Evite roupas apertadas e calcinhas que não sejam de algodão.
                Roupas apertadas e calcinhas que não são de algodão podem
                aumentar a umidade na área genital, o que pode contribuir para a
                incontinência urinária.
              </ListItem>
            </OrderedList>
          </Flex>
        </Flex>
      </SidebarPaciente>
    </>
  );
}

export const getServerSideProps = canSSRAuth("Paciente", async (ctx) => {
  return {
    props: {},
  };
});
