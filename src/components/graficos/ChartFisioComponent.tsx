import {
  Box,
  Flex,
  FormControl,
  RadioGroup,
  FormLabel,
  Input,
  Radio,
  useMediaQuery,
  FormHelperText,
} from "@chakra-ui/react";
import { format, parse, isAfter, isBefore, isSameDay } from "date-fns";
import { useRef, useEffect, useState } from "react";
import Chart from "chart.js/auto";
import {
  BarController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(BarController, CategoryScale, LinearScale, Title, Tooltip);

interface RegistroProps {
  urinaDatas: Date[];
  urinaQuantidades: number[];
  bebidaDatas: Date[];
  bebidaQuantidades: number[];
}

const RegistroFisio: React.FC<RegistroProps> = ({
  urinaDatas,
  urinaQuantidades,
  bebidaDatas,
  bebidaQuantidades,
}) => {
  const [isMobile] = useMediaQuery("(max-width: 500px)");

  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart<"bar"> | null>(null);

  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataFinal, setDataFinal] = useState<Date | null>(null);
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("ambos");

  const MAX_RANGE_DAYS = 10;

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const dataUrinaFiltrada: { [data: string]: number } = {};
        const dataBebidaFiltrada: { [data: string]: number } = {};

        if (tipoSelecionado === "urina" || tipoSelecionado === "ambos") {
          urinaDatas.forEach((data, index) => {
            const dateString = format(data, "dd/MM/yyyy");
            if (
              (!dataInicio || isAfter(data, dataInicio)) &&
              (!dataFinal ||
                isBefore(data, dataFinal) ||
                isSameDay(data, dataFinal))
            ) {
              if (!dataUrinaFiltrada[dateString]) {
                dataUrinaFiltrada[dateString] = urinaQuantidades[index];
              } else {
                dataUrinaFiltrada[dateString] += urinaQuantidades[index];
              }
            }
          });
        }

        if (tipoSelecionado === "bebida" || tipoSelecionado === "ambos") {
          bebidaDatas.forEach((data, index) => {
            const dateString = format(data, "dd/MM/yyyy");
            if (
              (!dataInicio || isAfter(data, dataInicio)) &&
              (!dataFinal ||
                isBefore(data, dataFinal) ||
                isSameDay(data, dataFinal))
            ) {
              if (!dataBebidaFiltrada[dateString]) {
                dataBebidaFiltrada[dateString] = bebidaQuantidades[index];
              } else {
                dataBebidaFiltrada[dateString] += bebidaQuantidades[index];
              }
            }
          });
        }

        const datasUrinaFiltrada = Object.keys(dataUrinaFiltrada);
        const quantidadesUrinaFiltrada = Object.values(dataUrinaFiltrada);

        const datasBebidaFiltrada = Object.keys(dataBebidaFiltrada);
        const quantidadesBebidaFiltrada = Object.values(dataBebidaFiltrada);

        const datasets = [
          {
            label:
              tipoSelecionado === "urina"
                ? "Quantidade de Urina (ml)"
                : tipoSelecionado === "ambos"
                ? "Quantidade de Urina (ml)"
                : "Quantidade de bebida (ml)",
            data:
              tipoSelecionado === "urina"
                ? quantidadesUrinaFiltrada
                : tipoSelecionado === "bebida"
                ? quantidadesBebidaFiltrada
                : quantidadesUrinaFiltrada,
            backgroundColor:
              tipoSelecionado === "urina"
                ? "rgba(255, 99, 132, 0.2)"
                : tipoSelecionado === "ambos"
                ? "rgba(255, 99, 132, 0.2)"
                : "rgba(54, 162, 235, 0.2)",
            borderColor:
              tipoSelecionado === "urina"
                ? "rgba(255, 99, 132, 1)"
                : tipoSelecionado === "ambos"
                ? "rgba(255, 99, 132, 1)"
                : "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ];

        if (tipoSelecionado === "ambos") {
          datasets.push({
            label: "Quantidade de Bebida (ml)",
            data: quantidadesBebidaFiltrada,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          });
        }

        const sortedDatasUrinaFiltrada = datasUrinaFiltrada.sort((a, b) => {
          const dateA = parse(a, "dd/MM/yyyy", new Date());
          const dateB = parse(b, "dd/MM/yyyy", new Date());
          return dateA.getTime() - dateB.getTime();
        });

        const sortedDatasBebidaFiltrada = datasBebidaFiltrada.sort((a, b) => {
          const dateA = parse(a, "dd/MM/yyyy", new Date());
          const dateB = parse(b, "dd/MM/yyyy", new Date());
          return dateA.getTime() - dateB.getTime();
        });

        const sortedQuantidadesUrinaFiltrada = sortedDatasUrinaFiltrada.map(
          (data) => dataUrinaFiltrada[data]
        );

        const sortedQuantidadesBebidaFiltrada = sortedDatasBebidaFiltrada.map(
          (data) => dataBebidaFiltrada[data]
        );

        const chartInstance = new Chart(ctx, {
          type: "bar",
          data: {
            labels:
              tipoSelecionado === "urina"
                ? sortedDatasUrinaFiltrada
                : tipoSelecionado === "bebida"
                ? sortedDatasBebidaFiltrada
                : sortedDatasUrinaFiltrada,
            datasets: datasets,
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                position: isMobile ? "bottom" : "top",
              },
              title: {
                display: true,
                text: "Gráfico de registros do paciente",
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          },
        });

        chartInstanceRef.current = chartInstance;
      }
    }
  }, [
    urinaDatas,
    urinaQuantidades,
    bebidaDatas,
    bebidaQuantidades,
    dataInicio,
    dataFinal,
    tipoSelecionado,
    isMobile,
  ]);

  const handleDataInicio = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dataInicioSelecionada = parse(
      event.target.value,
      "yyyy-MM-dd",
      new Date()
    );

    if (dataFinal && isBefore(dataInicioSelecionada, dataFinal)) {
      setDataFinal(dataInicioSelecionada);
    }

    setDataInicio(dataInicioSelecionada);
  };

  const handleDataFinal = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dataFinalSelecionada = parse(
      event.target.value,
      "yyyy-MM-dd",
      new Date()
    );

    if (dataInicio && isBefore(dataFinalSelecionada, dataInicio)) {
      setDataInicio(dataInicio);
    }

    setDataFinal(dataFinalSelecionada);
  };

  const handleTipoSelecionado = (value: string) => {
    setTipoSelecionado(value);
  };

  return (
    <Box maxWidth="1100px" margin="0 auto">
      <Flex direction="column" align="flex-start" marginBottom={4}>
        <Flex mb={2} p={1} direction={isMobile ? "column" : "row"}>
          <FormControl marginRight={4}>
            <FormLabel htmlFor="start-date">Data Inicial:</FormLabel>
            <Input
              _placeholder={{ color: "gray.400" }}
              focusBorderColor="pink.500"
              size="lg"
              id="start-date"
              type="date"
              value={dataInicio ? format(dataInicio, "yyyy-MM-dd") : ""}
              onChange={handleDataInicio}
            />
            <FormHelperText>
              Limite máximo de 10 dias entre o intervalo das datas.
            </FormHelperText>
          </FormControl>
          <FormControl marginRight={4}>
            <FormLabel htmlFor="end-date">Data Final:</FormLabel>
            <Input
              _placeholder={{ color: "gray.400" }}
              focusBorderColor="pink.500"
              size="lg"
              id="end-date"
              type="date"
              value={dataFinal ? format(dataFinal, "yyyy-MM-dd") : ""}
              onChange={handleDataFinal}
            />
          </FormControl>
        </Flex>
        <Flex mt={2} mb={2} p={1}>
          <FormControl>
            <FormLabel htmlFor="type">Tipo de registros:</FormLabel>
            <RadioGroup
              id="type"
              value={tipoSelecionado}
              onChange={handleTipoSelecionado}
              size="lg"
              colorScheme="pink"
            >
              <Flex mt={2}>
                <Radio value="ambos" mr={2}>
                  Ambos
                </Radio>
                <Radio value="urina" mr={2}>
                  Urina
                </Radio>
                <Radio value="bebida">Bebida</Radio>
              </Flex>
            </RadioGroup>
          </FormControl>
        </Flex>
      </Flex>
      <Flex h="100vh" maxH="420px">
        <canvas ref={chartRef} />
      </Flex>
    </Box>
  );
};

export default RegistroFisio;
