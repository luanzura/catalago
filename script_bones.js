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

const categories = {
  ALL: "",
  CAMISETAS: "camisetas-peruana-401",
  BONES: "bones-5panel-premium",
};

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
        displayProducts(data.list);
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

// Configuração inicial quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
  // Carregar todos os produtos inicialmente
  fetchProducts(categories.ALL);

  // Configurar abas
  const allTab = document.getElementById("all-products-tab");
  const camisetasTab = document.getElementById("camisetas-peruanas-tab");
  const bonesTab = document.getElementById("bones-premium-tab");

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

  if (bonesTab) {
    bonesTab.addEventListener("click", () => {
      fetchProducts(categories.BONES);
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
});

