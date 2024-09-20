// Variáveis globais para controlar os preços e a visibilidade
const precoVarejo = 39.9; // Defina o valor de varejo aqui
const precoAtacado = 18.0; // Defina o valor de atacado aqui
const aparecerPrecoVarejo = false; // Mostrar ou esconder preço de varejo
const aparecerPrecoAtacado = false; // Mostrar ou esconder preço de atacado

const numeroCelular = ""; // Número de WhatsApp
const mensagemWhatsApp = "Olá, vim do seu catálogo."; // Mensagem de WhatsApp
const mostrarNumeroCelular = false; // Mostrar ou esconder número de celular

const nomeEmpresa = "Atacado"; // Nome da empresa
const logoUrl = "./assets/logo.png"; // URL do logo
const mostrarLogo = true; // Mostrar ou esconder o logo

const simulador = true; // Variável para mostrar ou não o botão Simulador

// Variáveis globais para o banner
const banner = false; // Mostrar ou ocultar o banner
const bannerUrl = "./assets/banner.png"; // URL do banner

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

const categories = {
  ALL: "",
  CAMISETAS: "camisetas-peruana-401",
  PANEL: "bones-5panel-premium",
  RASGADINHO: "bones-rasgadinho",
  COUNTRY: "bones-country",
};

// Variável global para armazenar todos os produtos
let allProducts = [];

// Função para buscar produtos da API
function fetchProducts(category) {
  const fetchOptions = {
    ...options,
    body: JSON.stringify({
      ...JSON.parse(options.body),
      filter: {
        ...JSON.parse(options.body).filter,
        category: category,
      },
    }),
  };

  fetch("https://api.ecommerce.nextar.com/prod/api/products", fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro na solicitação: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data.list)) {
        allProducts = data.list; // Armazena todos os produtos
        displayProducts(allProducts); // Exibe todos os produtos inicialmente
      } else {
        console.error("A resposta da API não contém uma lista de produtos.");
      }
    })
    .catch((err) => console.error("Erro ao buscar produtos:", err));
}

// Função para exibir os produtos
function displayProducts(products) {
  const container = document.getElementById("product-container");
  container.innerHTML = ""; // Limpar o container antes de exibir os produtos

  products.forEach((product) => {
    const productCode = product.ProductCode;
    const productName = product.ProductName;
    const productImg = product.ProductImg;

    const imgUrl = `https://storage.googleapis.com/nexapp-flutter.appspot.com/production/products/${productImg}`;

    const productDiv = document.createElement("div");
    productDiv.classList.add("col-md-4", "product", "text-center", "mb-4");

    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = productName;
    img.classList.add("img-fluid");

    img.addEventListener("click", () => {
      window.open(imgUrl, "_blank");
    });

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

// Função para filtrar produtos com base na pesquisa
function filterProducts(searchTerm) {
  const filteredProducts = allProducts.filter((product) =>
    product.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayProducts(filteredProducts);
}

// Configuração inicial quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
  // Carregar todos os produtos inicialmente
  fetchProducts(categories.ALL);

  // Configurar abas
  const allTab = document.getElementById("all-products-tab");
  const camisetasTab = document.getElementById("camisetas-peruanas-tab");
  const bonesPanel = document.getElementById("bones-panel");
  const bonesRasgadinho = document.getElementById("bones-rasgadinho");
  const bonesCountry = document.getElementById("bones-country");

  if (allTab) {
    allTab.addEventListener("click", () => {
      fetchProducts(categories.ALL);
    });
  }

  if (camisetasTab) {
    camisetasTab.addEventListener("click", () => {
      fetchProducts(categories.CAMISETAS);
    });
  }

  if (bonesPanel) {
    bonesPanel.addEventListener("click", () => {
      fetchProducts(categories.PANEL);
    });
  }

  if (bonesRasgadinho) {
    bonesRasgadinho.addEventListener("click", () => {
      fetchProducts(categories.RASGADINHO);
    });
  }

  if (bonesCountry) {
    bonesCountry.addEventListener("click", () => {
      fetchProducts(categories.COUNTRY);
    });
  }

  // Exibe o botão "Simulador" ao lado da barra de pesquisa se simulador for true
  const simuladorButton = document.getElementById("simulador-btn");
  if (simulador && simuladorButton) {
    simuladorButton.style.display = "inline-block";
    simuladorButton.addEventListener("click", () => {
      window.location.href = "simulador.html"; // Redireciona para simulador.html
    });
  }

  // Atualiza o HTML da página inicial com nome da empresa e logo, se necessário
  if (mostrarLogo) {
    const logoImg = document.querySelector(".logo img");
    const logoTitle = document.querySelector(".logo h1");

    if (logoImg) {
      logoImg.src = logoUrl;
    }

    if (logoTitle) {
      logoTitle.textContent = nomeEmpresa;
    }
  }

  // Exibe o banner se a variável banner for true
  const bannerContainer = document.getElementById("banner-container");
  if (banner && bannerContainer) {
    bannerContainer.style.display = "block";
    const bannerImg = document.getElementById("banner-img");

    if (bannerImg) {
      bannerImg.src = bannerUrl;
    }
  }

  // Adiciona a funcionalidade de pesquisa
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value;
      filterProducts(searchTerm);
    });
  }
});
