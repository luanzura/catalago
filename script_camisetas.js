// Variáveis globais para controlar os preços e a visibilidade
const camisetaPrecoVarejo = 39.9; // Defina o valor de varejo aqui
const camisetaPrecoAtacado = 18.0; // Defina o valor de atacado aqui
const aparecerPrecoVarejoCamiseta = false; // Defina como true ou false para mostrar ou esconder o preço de varejo
const aparecerPrecoAtacadoCamiseta = false; // Defina como true ou false para mostrar ou esconder o preço de atacado

const numeroCelularCamiseta = ""; // Número de WhatsApp para camisetas
const mensagemWhatsAppCamiseta = "Olá, vim do seu catálogo."; // Mensagem de WhatsApp para camisetas
const mostrarNumeroCelularCamiseta = false; // Defina como true ou false para mostrar ou esconder o número de celular

document.addEventListener("DOMContentLoaded", function () {
  const bonesPremiumBtn = document.getElementById("bones-premium-btn");
  const camisetasPeruanasBtn = document.getElementById(
    "camisetas-peruanas-btn"
  );
  const productContainer = document.getElementById("product-container");

  bonesPremiumBtn.addEventListener("click", () => {
    fetchBonesPremiumProducts();
  });

  camisetasPeruanasBtn.addEventListener("click", () => {
    fetchCamisetasPeruanasProducts();
  });

  function fetchCamisetasPeruanasProducts() {
    fetch(
      "https://api.rediredi.com/inventory/storefront/items?sortBy=title.asc&perPage=100&page=1&query=&filterBy=category%3A%3A526947fb-43d7-41fd-8915-95a58cfe8d58",
      {
        headers: {
          "x-rr-store-id": "97eb83c3-14f9-4034-9a14-f76c70ea10d8",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        displayProducts(data.data, "camisetas-peruanas");
      })
      .catch((error) =>
        console.error("Error fetching Camisetas Peruanas products:", error)
      );
  }

  function displayProducts(products, category) {
    productContainer.innerHTML = ""; // Clear previous products

    if (!Array.isArray(products)) {
      console.error("Produtos não estão no formato esperado:", products);
      return;
    }

    products.forEach((product) => {
      const baseVariant = product.baseVariant || {};
      const additionalVariants = product.additionalVariants || [];

      // Agrupar por cor e tamanho
      const colorGroups = {};

      additionalVariants.forEach((variant) => {
        if (variant.quantityAvailable > 0) {
          const color =
            variant.optionMapping?.find((option) => option.name === "Cor")
              ?.value || "Cor não disponível";
          const size =
            variant.optionMapping?.find((option) => option.name === "Tamanho")
              ?.value || "Tamanho não disponível";

          if (!colorGroups[color]) {
            colorGroups[color] = { sizes: [], images: [] };
          }

          if (!colorGroups[color].sizes.includes(size)) {
            colorGroups[color].sizes.push(size);
          }

          if (!colorGroups[color].images.includes(variant.pictures[0])) {
            colorGroups[color].images.push(variant.pictures[0]);
          }
        }
      });

      Object.keys(colorGroups).forEach((color) => {
        const colorProduct = colorGroups[color];

        colorProduct.images.forEach((image) => {
          const productElement = document.createElement("div");
          productElement.classList.add("product");

          productElement.innerHTML = `
              <img src="${image}" alt="${
            baseVariant.title || "Imagem não disponível"
          }" />
              <h3 class="nome">${
                baseVariant.title || "Nome não disponível"
              }</h3>
              <p class="codigo">Código: ${
                baseVariant.sku || "Código não disponível"
              }</p>
              ${
                aparecerPrecoVarejoCamiseta || aparecerPrecoAtacadoCamiseta
                  ? `<div class="precos">
                      ${
                        aparecerPrecoVarejoCamiseta
                          ? `<p class="preco varejo">Preço de Varejo: R$ ${camisetaPrecoVarejo
                              .toFixed(2)
                              .replace(".", ",")}</p>`
                          : ""
                      }
                      ${
                        aparecerPrecoAtacadoCamiseta
                          ? `<p class="preco atacado">Preço de Atacado: R$ ${camisetaPrecoAtacado
                              .toFixed(2)
                              .replace(".", ",")}</p>`
                          : ""
                      }
                    </div>`
                  : ""
              }
              <p><strong>Cor:</strong> ${color}</p>
              <div class="sizes-container">
                ${colorProduct.sizes
                  .map((size) => `<span class="size-box">${size}</span>`)
                  .join("")}
              </div>
              ${
                mostrarNumeroCelularCamiseta
                  ? `<a href="https://wa.me/${numeroCelularCamiseta}?text=${encodeURIComponent(
                      mensagemWhatsAppCamiseta
                    )}" class="btn mb-2 btn-success" target="_blank">Entrar em Contato</a>`
                  : ""
              }
            `;

          productContainer.appendChild(productElement);
        });
      });
    });
  }
});
