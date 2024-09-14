// Definindo os tamanhos das caixas
const caixas = {
  P: { altura: 17, largura: 24, comprimento: 34 },
  M: { altura: 17, largura: 21, comprimento: 58 },
  G: { altura: 33, largura: 21, comprimento: 58 },
  GG: { altura: 33, largura: 42, comprimento: 60 },
};

document
  .getElementById("simulacaoForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Pegando a quantidade e o CEP do form
    const quantidade = parseInt(document.getElementById("quantidade").value);
    let cepDestino = document.getElementById("cepDestino").value;

    // Remover caracteres especiais do CEP
    cepDestino = cepDestino.replace(/[^\d]/g, "");

    // Validar se a quantidade e o CEP são fornecidos
    if (isNaN(quantidade) || !cepDestino) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    // Calculando peso e valor
    const pesoTotal = quantidade * 0.12; // 0.120 kg por boné
    const valorTotal = quantidade * 12.0; // R$12.00 por boné

    // Definindo o tamanho da caixa com base na quantidade
    let tamanhoCaixa;
    if (quantidade <= 12) {
      tamanhoCaixa = caixas.P;
    } else if (quantidade <= 30) {
      tamanhoCaixa = caixas.M;
    } else if (quantidade <= 60) {
      tamanhoCaixa = caixas.G;
    } else {
      tamanhoCaixa = caixas.GG;
    }

    // Dados para enviar na requisição
    const requestData = {
      cepOrigem: "86802617", // CEP fixo de origem
      cepDestino: cepDestino,
      vlrMerc: valorTotal,
      pesoMerc: pesoTotal,
      volumes: [
        {
          peso: pesoTotal,
          altura: tamanhoCaixa.altura,
          largura: tamanhoCaixa.largura,
          comprimento: tamanhoCaixa.comprimento,
          tipo: "C", // Tipo fixo de pacote
          valor: valorTotal,
          quantidade: quantidade,
        },
      ],
      servicos: ["X", "E"], // Servicos fixos
      ordernar: "preco", // Ordenação por preço
    };

    try {
      // Fazendo o fetch para a API
      const response = await fetch(
        "https://api-kangu.vercel.app/simular-transporte",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData), // Convertendo o objeto para JSON
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Inicializando visibilidade dos resultados
        const pacDiv = document.getElementById("pac");
        const sedexDiv = document.getElementById("sedex");
        pacDiv.classList.add("d-none");
        sedexDiv.classList.add("d-none");

        // Verificando e exibindo o resultado do PAC
        const pacResult = data.find(
          (item) => item.transp_nome === "Correios PAC"
        );
        if (pacResult) {
          document.getElementById("pac-preco").textContent =
            pacResult.vlrFrete.toFixed(2);
          document.getElementById("pac-prazo").textContent = pacResult.prazoEnt;
          document.getElementById("pac-img").src = pacResult.url_logo;
          pacDiv.classList.remove("d-none");
        }

        // Verificando e exibindo o resultado do Sedex
        const sedexResult = data.find(
          (item) => item.transp_nome === "Correios Sedex"
        );
        if (sedexResult) {
          document.getElementById("sedex-preco").textContent =
            sedexResult.vlrFrete.toFixed(2);
          document.getElementById("sedex-prazo").textContent =
            sedexResult.prazoEnt;
          document.getElementById("sedex-img").src = sedexResult.url_logo;
          sedexDiv.classList.remove("d-none");
        }

        // Exibindo o resultado na página
        document.getElementById("resultado").classList.remove("d-none");
      } else {
        throw new Error("Erro na simulação de frete");
      }
    } catch (error) {
      document.getElementById("mensagemResultado").innerHTML =
        "Erro ao fazer a simulação de frete. Tente novamente.";
      document.getElementById("resultado").classList.remove("d-none");
    }
  });
