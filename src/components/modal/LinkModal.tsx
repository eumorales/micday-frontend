import NextLink from "next/link";
import { useState } from "react";
import {
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
} from "@chakra-ui/react";

// Componente do Modal de Termos de Uso
export const TermosModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Termos de Uso</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Bem-vindo ao mic.day, este sistema é desenvolvido para ajudar pessoas
          com incontinência urinária a gerenciar seus sintomas. Os seguintes
          termos e condições (o Termos de Uso) governam o uso do sistema. Ao
          usar o sistema, você concorda com estes{" "}
          <strong>Termos de Uso e com a Política de Privacidade</strong> do
          sistema.
          <br></br>
          <br></br>
          <strong>1. Uso do sistema</strong>
          <br></br>O mic.day destina-se a ajudar as pessoas que sofrem de
          incontinência urinária a gerenciar seus sintomas. Ao usar o mic.day,
          você concorda em não fazer nada que possa danificar ou sobrecarregar
          os sistemas de infraestrutura do sistema ou interferir no uso do
          sistema por outros usuários. Você concorda em usar o sistema apenas
          para os fins pretendidos e de acordo com todas as leis e regulamentos
          aplicáveis.
          <br></br>
          <strong>2. Registro e Conta do Usuário</strong>
          <br></br> Para usar o sistema, você deve se registrar e criar uma
          conta de usuário. Você concorda em fornecer informações precisas,
          atualizadas e completas ao se registrar e criar uma conta de usuário.
          Você é responsável por manter a confidencialidade de sua senha e por
          todas as atividades que ocorrem em sua conta.
          <br></br>
          <strong>3. Propriedade Intelectual</strong>
          <br></br>Todo o conteúdo e funcionalidade do sistema, incluindo, mas
          não se limitando a, gráficos, imagens, texto, vídeo, áudio e código de
          computador (o "Conteúdo"), é protegido por leis de propriedade
          intelectual, incluindo leis de direitos autorais, patentes, marcas
          registradas e outras leis de propriedade intelectual. Você reconhece
          que todo o Conteúdo é propriedade exclusiva da Empresa ou de seus
          licenciadores. Você não pode copiar, reproduzir, modificar, criar
          trabalhos derivados, distribuir, transmitir, exibir ou usar o Conteúdo
          de qualquer forma sem a autorização prévia por escrito da Empresa.
          Isenção de Garantias O sistema é fornecido "como está" e sem garantias
          de qualquer tipo, expressas ou implícitas, incluindo, mas não se
          limitando a, garantias implícitas de comercialização, adequação a uma
          finalidade específica, não violação ou desempenho.
          <br></br>
          <strong>4. Limitação de Responsabilidade</strong>
          <br></br>
          Em nenhuma circunstância a Empresa será responsável por quaisquer
          danos, incluindo, mas não se limitando a, danos diretos, indiretos,
          incidentais, especiais, punitivos ou consequentes decorrentes ou
          relacionados ao uso ou incapacidade de uso do sistema ou do Conteúdo,
          mesmo que a Empresa tenha sido informada da possibilidade de tais
          danos.
          <br></br>
          <strong>5. Indenização</strong>
          <br></br> Você concorda em defender, indenizar e isentar a Empresa e
          seus funcionários, diretores, agentes, afiliados e licenciadores de e
          contra quaisquer reivindicações, ações, demandas, danos, custos ou
          despesas, incluindo honorários advocatícios razoáveis, resultantes de
          ou relacionados ao seu uso do sistema, seu Conteúdo, sua violação
          destes Termos de Uso ou qualquer atividade relacionada à sua conta de
          usuário. ,<br></br>
          <strong>6. Rescisão</strong>
          <br></br> A Empresa pode rescindir estes Termos de Uso e o seu acesso
          ao sistema a qualquer momento, por qualquer motivo ou sem motivo. Você
          pode rescindir estes Termos de Uso e seu acesso ao ssitema excluindo
          sua conta de usuário. Alterações nos Termos de Uso A Empresa pode
          alterar estes Termos de Uso a qualquer momento, a seu exclusivo
          critério. A Empresa notificará você de qualquer alteração enviando um
          aviso por e-mail ou publicando um aviso no sistema. O uso continuado
          do sistema após a notificação de uma alteração nos Termos de Uso será
          considerado como sua aceitação da alteração.
          <br></br>
          <strong>Disposições Gerais</strong>
          <br></br> Estes Termos de Uso constituem o acordo completo entre você
          e a Empresa com relação ao uso do sistema e substituem todos os
          acordos anteriores e contemporâneos e comunicações orais ou escritas
          com relação ao assunto aqui tratado. Se qualquer disposição destes
          Termos de Uso for considerada inválida ou inexequível, tal disposição
          será anulada ou limitada na medida mínima necessária, e as disposições
          restantes continuarão em pleno vigor e efeito. A falha da Empresa em
          exercer ou fazer cumprir qualquer direito ou disposição destes Termos
          de Uso não constituirá uma renúncia a tal direito ou disposição. Estes
          Termos de Uso são regidos pelas leis do Rio Grande do Sul/Brasil e
          quaisquer disputas decorrentes ou relacionadas a estes Termos de Uso
          serão resolvidas exclusivamente nos tribunais do Rio Grande do
          Sul/Brasil.
          <br></br>
          Ao usar o sistema, você concorda com estes Termos de Uso e com a
          Política de Privacidade do sistema. Se você tiver alguma dúvida ou
          preocupação sobre estes Termos de Uso ou o sistema, entre em contato
          conosco em victor.marques@ufn.edu.br.
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Componente do Modal de Política de Privacidade
export const PoliticaModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <Modal isOpen onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Política de Privacidade</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Este Contrato de Licença do Usuário Final ("EULA") e Política de
          Privacidade ("Política de Privacidade") regem o uso do sistema para
          auxilio no tratamento de pacientes com incontinência urinária mic.day
          disponibilizado aos usuários. Ao utilizar o sistema, o Usuário
          concorda em estar legalmente vinculado a este EULA e Política de
          Privacidade. Se o Usuário não concordar com os termos deste EULA e
          Política de Privacidade, não deverá usar o sistema.<br></br>
          <br></br>
          <strong>Licença de Uso</strong>
          <br></br>A Empresa concede ao Usuário uma licença limitada, não
          exclusiva, intransferível e revogável para usar o Sistema em um
          dispositivo móvel pessoal para uso pessoal. O Usuário não pode usar o
          sistema para fins comerciais ou de outra forma, além de sua finalidade
          prevista. O Usuário não pode copiar, modificar, distribuir, vender,
          sublicenciar ou transferir o sistema ou qualquer parte dele sem a
          permissão expressa por escrito da Empresa. A Empresa reserva-se o
          direito de atualizar, modificar, interromper ou descontinuar o sistema
          a qualquer momento, sem aviso prévio ou responsabilidade.<br></br>
          <strong>Coleta de Dados e Privacidade</strong>
          <br></br>A Empresa coleta informações pessoais do Usuário para
          fornecer serviços de suporte ao sistema e melhorar a experiência do
          usuário. A Empresa pode coletar informações, incluindo, mas não se
          limitando a, informações de contato, informações de registro e
          informações do dispositivo. A Empresa não venderá, alugará ou
          divulgará essas informações a terceiros sem o consentimento expresso
          do Usuário. A Empresa pode usar as informações coletadas para fornecer
          atualizações de produtos e marketing direto ao Usuário, mas o Usuário
          pode optar por não receber essas comunicações.
          <br></br>
          <strong>Isenção de Responsabilidade e Garantias</strong>
          <br></br>O sistema é fornecido "no estado em que se encontra" e
          "conforme disponível" sem garantias de qualquer tipo, expressas ou
          implícitas, incluindo, mas não se limitando a, garantias de
          comercialização, adequação a um propósito específico e não violação. A
          Empresa não garante que o sistema seja livre de erros, interrupções,
          vírus ou outros defeitos. O Usuário assume total responsabilidade pelo
          uso do sistema. A Empresa não será responsável por quaisquer danos
          diretos, indiretos, incidentais, especiais, consequentes ou punitivos
          resultantes do uso ou incapacidade de usar o sistema.
          <br></br>
          <strong>Lei Aplicável e Jurisdição</strong>
          <br></br>
          Este EULA e Política de Privacidade serão regidos pelas leis do país
          em que a Empresa está registrada. O Usuário concorda que qualquer ação
          legal ou litígio decorrente ou relacionado a este EULA e Política de
          Privacidade será resolvido exclusivamente nos tribunais competentes
          localizados no país em que a Empresa está registrada.
          <br></br>
          <strong>Alterações ao EULA e Política de Privacidade</strong>
          <br></br>A Empresa reserva-se o direito de modificar ou atualizar este
          EULA e Política de Privacidade a qualquer momento, a seu exclusivo
          critério. O Usuário será notificado de quaisquer alterações
          significativas através do sistema ou por e-mail. O uso continuado do
          sistema após tais alterações constituirá a aceitação das mesmas pelo
          Usuário.
          <br></br>
          <strong>Rescisão</strong>
          <br></br>
          Este EULA e Política de Privacidade podem ser rescindidos pela Empresa
          ou pelo Usuário a qualquer momento. No caso de rescisão pelo Usuário,
          o Usuário deve desinstalar o sistema e excluir todas as cópias do
          sistema em seu dispositivo móvel. A rescisão não afetará nenhum
          direito adquirido pelo Usuário antes da rescisão.
          <br></br>
          <strong>Divisibilidade</strong>
          <br></br>
          Se qualquer disposição deste EULA e Política de Privacidade for
          considerada inválida ou inexequível por um tribunal competente, tal
          disposição será alterada e interpretada para melhor cumprir seus
          objetivos originais na medida do possível e o restante deste EULA e
          Política de Privacidade permanecerá em pleno vigor e efeito.
          <br></br>
          <strong>Integralidade do Acordo</strong>
          <br></br>
          Este EULA e Política de Privacidade representam o acordo completo
          entre a Empresa e o Usuário em relação ao uso do sistema e substituem
          todos os acordos, entendimentos, negociações e discussões anteriores
          entre as partes. Qualquer alteração ou modificação deste EULA e
          Política de Privacidade deve ser feita por escrito e assinada por
          ambas as partes. Ao clicar em "Aceito" e usar o Sistema, o Usuário
          reconhece ter lido, compreendido e concordado com os termos deste EULA
          e Política de Privacidade.
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// Componente do texto com os links para os modais
export const TextoComLinks = () => {
  const [isTermosModalOpen, setIsTermosModalOpen] = useState(false);
  const [isPoliticaModalOpen, setIsPoliticaModalOpen] = useState(false);

  const handleOpenTermosModal = () => {
    setIsTermosModalOpen(true);
  };

  const handleOpenPoliticaModal = () => {
    setIsPoliticaModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsTermosModalOpen(false);
    setIsPoliticaModalOpen(false);
  };

  return (
    <>
      <Text mb={6} fontSize={16} pl={1}>
        Ao se registrar, você concorda com nossos{" "}
        <NextLink href="#" passHref>
          <Box as="span" onClick={handleOpenTermosModal} color="pink.600">
            <strong>termos de uso</strong>
          </Box>
        </NextLink>{" "}
        e nossa{" "}
        <NextLink href="#" passHref>
          <Box as="span" onClick={handleOpenPoliticaModal} color="pink.600">
            <strong> política de privacidade</strong>.
          </Box>
        </NextLink>
      </Text>

      {/* Modal de Termos de Uso */}
      {isTermosModalOpen && <TermosModal onClose={handleCloseModals} />}

      {/* Modal de Política de Privacidade */}
      {isPoliticaModalOpen && <PoliticaModal onClose={handleCloseModals} />}
    </>
  );
};
