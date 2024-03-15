import { useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import Logo from "../../../public/images/Logo.svg";
import Bg from "../../../public/images/bg.svg";
import {
  Flex,
  Stack,
  Box,
  Text,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Button,
  Radio,
  RadioGroup,
  useMediaQuery,
  FormControl,
  FormLabel,
  FormHelperText
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, EmailIcon, LockIcon } from "@chakra-ui/icons";
import { Icon } from "@chakra-ui/react";
import { HiUser, HiClipboardList, HiPhone } from "react-icons/hi";
import Link from "next/link";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Cadastro() {
  const { cadastrarUsuario } = useContext(AuthContext);
  const [imageDisplay] = useMediaQuery("(max-width: 750px)");

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipo, setTipo] = useState("");

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  async function handleCadastro() {
    if (
      nome === "" ||
      email === "" ||
      senha === "" ||
      cpf === "" ||
      tipo === "" ||
      telefone === ""
    ) {
      toast.error("Preencha todos os campos.");
      return;
    }

    if (senha.length < 6) {
      toast.warning("Sua senha precisa ter no mínimo 6 dígitos!");
      return;
    }

    if (cpf.length !== 11) {
      toast.warning("CPF inválido! Informe apenas os 11 números.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.warning("E-mail inválido! Verifique o formato do e-mail.");
      return;
    }

    const telefonePattern = /^\+?\d{0,3}[-.\s]?\(?\d{2,3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}$/;
    ;
    if (!telefonePattern.test(telefone)) {
      toast.warning("Informe um número de telefone válido!");
      return;
    }

    await cadastrarUsuario({
      nome,
      email,
      senha,
      cpf,
      telefone,
      tipo,
    });
  }

  return (
    <>
      <Head>
        <title> Cadastro | mic.day </title>
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
              Criar uma conta
            </Text>

            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <InputGroup size="lg">
                <InputLeftElement
                  children={<Icon as={HiUser} color="gray.400" w={5} h={5} />}
                />
                <Input
                  size="lg"
                  placeholder="Nome completo"
                  _placeholder={{ color: "gray.400" }}
                  focusBorderColor="pink.500"
                  type="text"
                  mb={3}
                  isRequired
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>E-mail </FormLabel>
              <InputGroup size="lg">
                <InputLeftElement children={<EmailIcon color="gray.400" />} />
                <Input
                  variant={"outline"}
                  size="lg"
                  placeholder="email@email.com"
                  _placeholder={{ color: "gray.400" }}
                  focusBorderColor="pink.500"
                  type="email"
                  mb={3}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Senha </FormLabel>
              <InputGroup size="lg" mb={3}>
                <InputLeftElement children={<LockIcon color="gray.400" />} />
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  variant={"outline"}
                  placeholder="*************"
                  _placeholder={{ color: "gray.400" }}
                  focusBorderColor="pink.500"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    bg="transparent"
                    size="sm"
                    onClick={handleClick}
                    _hover={{ bg: "transparent" }}
                  >
                    {show ? (
                      <ViewOffIcon
                        boxSize={6}
                        bg=""
                        color="pink.600"
                        _hover={{ bg: "transparent" }}
                      />
                    ) : (
                      <ViewIcon
                        boxSize={6}
                        bg="transparent"
                        color="pink.600"
                        _hover={{ bg: "transparent" }}
                      />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Número de celular</FormLabel>
              <InputGroup size="lg">
                <InputLeftElement
                  children={
                    <Icon as={HiPhone} color="gray.400" w={5} h={5} />
                  }
                />
                <Input
                  size="lg"
                  placeholder="(55) 99999-9999"
                  _placeholder={{ color: "gray.400" }}
                  focusBorderColor="pink.500"
                  type="text"
                  maxLength={15}
                  mb={3}
                  value={telefone}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 16) {
                      setTelefone(inputValue);
                    }
                  }}
                />
              </InputGroup>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>CPF</FormLabel>
              <InputGroup size="lg">
                <InputLeftElement
                  children={
                    <Icon as={HiClipboardList} color="gray.400" w={5} h={5} />
                  }
                />
                <Input
                  size="lg"
                  placeholder="000.000.000-00"
                  _placeholder={{ color: "gray.400" }}
                  focusBorderColor="pink.500"
                  type="number"
                  maxLength={11}
                  mb={3}
                  value={cpf}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue.length <= 11) {
                      setCpf(inputValue);
                    }
                  }}
                />
              </InputGroup>
              <FormHelperText mt={0} mb={4}>
                Informe apenas números no CPF.
              </FormHelperText>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Tipo de usuário</FormLabel>
              <RadioGroup
                size="lg"
                p={1}
                mb={3}
                value={tipo}
                onChange={setTipo}
              >
                <Stack spacing={6} direction="row" mb={3}>
                  <Radio
                    value="Paciente"
                    colorScheme="pink"
                    borderColor="pink.600"
                  >
                    Paciente
                  </Radio>
                  <Radio
                    value="Fisioterapeuta"
                    colorScheme="pink"
                    borderColor="pink.600"
                  >
                    Fisioterapeuta
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <Button
              onClick={handleCadastro}
              background="pink.600"
              color="#FFF"
              size="lg"
              borderRadius={24}
              mb={7}
              _hover={{ bg: "pink.500" }}
            >
              Criar conta
            </Button>

            <Center>
              <Link href="/">
                <Text cursor="pointer">
                  Já possui conta? <strong>Faça login</strong>
                </Text>
              </Link>
            </Center>
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
