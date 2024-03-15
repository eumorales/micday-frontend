import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Box,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

const TermosModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Box pl={4}>
        <Button
          bg="transparent"
          color="pink.300"
          _hover={{ bg: "transparent", color: "pink.200" }}
          onClick={handleOpen}
        >
          Termos de uso
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={handleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Termos de Uso</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
            A ser desenvolvido em caso de utilização profissional do software.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="pink" onClick={handleClose}>
              Fechar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TermosModal;
