import React, { useEffect, useState } from "react";
import Head from "next/head";
import { SidebarPaciente } from "@/components/sidebar/paciente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import Registro from "@/components/graficos/ChartComponent";

export default function DadosPaciente({ urinas, bebidas }) {
  const [urinaRegistros, setUrinaRegistros] = useState(urinas);
  const [bebidaRegistros, setBebidaRegistros] = useState(bebidas);

  useEffect(() => {
    const fetchUrinaRegistros = async () => {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/urina/detalhes");
        setUrinaRegistros(response.data);
      } catch (error) {
        console.error("Erro ao buscar registros de urina:", error);
      }
    };

    const fetchBebidaRegistros = async () => {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.get("/bebida/detalhes");
        setBebidaRegistros(response.data);
      } catch (error) {
        console.error("Erro ao buscar registros de bebida:", error);
      }
    };

    fetchUrinaRegistros();
    fetchBebidaRegistros();
  }, []);

  const urinaDatas = urinaRegistros.map((registro) => {
    const date = new Date(registro.data);
    return date;
  });
  const urinaQuantidades = urinaRegistros.map((registro) => registro.quantidade);

  const bebidaDatas = bebidaRegistros.map((registro) => {
    const date = new Date(registro.data);
    return date;
  });
  const bebidaQuantidades = bebidaRegistros.map((registro) => registro.quantidade);

  return (
    <>
      <Head>
        <title>Análise de Dados | mic.day</title>
      </Head>
      <SidebarPaciente>
        <Registro
          urinaDatas={urinaDatas}
          urinaQuantidades={urinaQuantidades}
          bebidaDatas={bebidaDatas}
          bebidaQuantidades={bebidaQuantidades}
        />
      </SidebarPaciente>
    </>
  );
}

export const getServerSideProps = canSSRAuth("Paciente", async (ctx) => {
  try {
    const apiClient = setupAPIClient(ctx);
    const urinaResponse = await apiClient.get("/urina/detalhes");
    const bebidaResponse = await apiClient.get("/bebida/detalhes");

    if (urinaResponse.data === null || bebidaResponse.data === null) {
      return {
        redirect: {
          destination: "/dashboard/paciente",
          permanent: false,
        },
      };
    }

    return {
      props: {
        urinas: urinaResponse.data,
        bebidas: bebidaResponse.data,
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
