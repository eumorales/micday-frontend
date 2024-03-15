import { useState } from "react";
import {
  Input,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import { setupAPIClient } from "@/services/api";

export default function RecuperarSenha() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleRecuperarSenha = async () => {
    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, digite um email válido",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/recuperar-senha", {
        email,
      });

      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setEmail("");
      closeModal();
    } catch (error) {
      console.error("Erro ao enviar o email de recuperação de senha:", error);
      toast({
        title: "Erro",
        description:
          "Ocorreu um erro ao enviar o email de recuperação de senha",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button
        onClick={openModal}
        bg="transparent"
        _hover={{ bg: "transparent", color: "pink.500" }}
      >
        Esqueceu sua senha?
      </Button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Recuperar Senha</ModalHeader>
          <ModalBody>
            <Input
              variant={"outline"}
              size="lg"
              _placeholder={{ color: "gray.400" }}
              focusBorderColor="pink.600"
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleRecuperarSenha}
              bg="pink.600"
              color="white"
              _hover={{ bg: "pink.500" }}
            >
              Recuperar Senha
            </Button>
            <Button
              bg="transparent"
              borderColor="transparent"
              variant="outline"
              _hover={{ bg: "transparent", color: "pink.600" }}
              ml={3}
              onClick={closeModal}
            >
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
