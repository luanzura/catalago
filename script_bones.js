// Variáveis globais para controlar os preços e a visibilidade
const precoVarejo = 39.9;
const precoAtacado = 18.0;
const aparecerPrecoVarejo = true;
const aparecerPrecoAtacado = true;

const numeroCelular = "1234567890";
const mensagemWhatsApp = "Olá, vim do seu catálogo.";
const mostrarNumeroCelular = true;

const simulador = true;

const banner = true;
const bannerUrl = "./assets/banner.png";

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Shop-Code": "648669",
  },
  body: JSON.stringify({
    filter: {
      stockControl: true,
      page: 1,
      perPage: 500,
      category: "",
      subCategory: "",
      search: null,
      sort: { ProductName: 1 },
      onlyPromo: false,
    },
  }),
};

let productList = [];

// Função para buscar e exibir os produtos da API
function fetchProducts() {
  fetch("https://api.ecommerce.nextar.com/prod/api/products", options)
    .then((response) => response.json())
    .then((data) => {
      productList = data.list;
      displayProducts(productList);
    })
    .catch((err) => console.error("Erro ao buscar produtos:", err));
}

// Função para exibir produtos filtrados por categoria
function displayProducts(products, category = "Todos") {
  const container = document.getElementById("product-container");
  container.innerHTML = "";

  const filteredProducts =
    category === "Todos"
      ? products
      : products.filter((product) => product.Category === category);

  filteredProducts.forEach((product) => {
    const productCode = product.ProductCode;
    const productName = product.ProductName;

    // Verificação se a propriedade Photos existe e se tem ao menos uma imagem
    const productImg =
      product.Photos && product.Photos.length > 0
        ? product.Photos[0].url
        : "https://via.placeholder.com/150"; // Imagem placeholder caso não tenha imagem disponível

    const productDiv = document.createElement("div");
    productDiv.classList.add("col-md-4", "product", "text-center", "mb-4");

    const img = document.createElement("img");
    img.src = productImg;
    img.alt = productName;
    img.classList.add("img-fluid");

    const namePara = document.createElement("p");
    namePara.textContent = productName;
    namePara.classList.add("nome");

    const priceContainer = document.createElement("div");
    if (aparecerPrecoVarejo) {
      const priceVarejoPara = document.createElement("p");
      priceVarejoPara.textContent = `Varejo: R$${precoVarejo
        .toFixed(2)
        .replace(".", ",")}`;
      priceContainer.appendChild(priceVarejoPara);
    }

    if (aparecerPrecoAtacado) {
      const priceAtacadoPara = document.createElement("p");
      priceAtacadoPara.textContent = `Atacado: R$${precoAtacado
        .toFixed(2)
        .replace(".", ",")}`;
      priceContainer.appendChild(priceAtacadoPara);
    }

    const codePara = document.createElement("p");
    codePara.classList.add("codigo");
    codePara.textContent = `Código do produto: ${productCode}`;

    const contactButton = document.createElement("a");
    contactButton.href = `https://wa.me/${numeroCelular}?text=${encodeURIComponent(
      mensagemWhatsApp
    )}`;
    contactButton.target = "_blank";
    contactButton.classList.add("btn", "btn-success", "mt-2", "mb-2");

    const whatsappIcon = document.createElement("i");
    whatsappIcon.classList.add("bi", "bi-whatsapp");

    contactButton.appendChild(whatsappIcon);
    contactButton.appendChild(document.createTextNode(" Entrar em Contato"));

    productDiv.appendChild(img);
    productDiv.appendChild(namePara);
    productDiv.appendChild(priceContainer);
    productDiv.appendChild(codePara);
    if (mostrarNumeroCelular) {
      productDiv.appendChild(contactButton);
    }

    container.appendChild(productDiv);
  });
}

// Filtrar por categoria
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  document.getElementById("todos-btn").addEventListener("click", () => {
    displayProducts(productList, "Todos");
  });

  document
    .getElementById("camisetas-peruanas-btn")
    .addEventListener("click", () => {
      displayProducts(productList, "Camisetas Peruana 40.1 ");
    });

  document.getElementById("bones-5panel-btn").addEventListener("click", () => {
    displayProducts(productList, "Bonés 5Panel Premium");
  });

  document.getElementById("search-input").addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredProducts = productList.filter((product) =>
      product.ProductName.toLowerCase().includes(searchTerm)
    );

    displayProducts(filteredProducts);
  });

  const simuladorButton = document.getElementById("simulador-btn");
  if (simulador) {
    simuladorButton.style.display = "inline-block";
    simuladorButton.addEventListener("click", () => {
      window.location.href = "simulador.html";
    });
  }

  const bannerContainer = document.getElementById("banner-container");
  const bannerImg = document.getElementById("banner-img");

  if (banner) {
    bannerContainer.style.display = "block";
    bannerImg.src = bannerUrl;
  } else {
    bannerContainer.style.display = "none";
  }
});
