// Variáveis globais para controlar os preços e a visibilidade
const precoVarejo = 39.9; // Defina o valor de varejo aqui
const precoAtacado = 18.0; // Defina o valor de atacado aqui
const aparecerPrecoVarejo = false; // Defina como true ou false para mostrar ou esconder o preço de varejo
const aparecerPrecoAtacado = false; // Defina como true ou false para mostrar ou esconder o preço de atacado

const numeroCelular = ""; // Número de WhatsApp
const mensagemWhatsApp = "Olá, vim do seu catálogo."; // Mensagem de WhatsApp
const mostrarNumeroCelular = true; // Defina como true ou false para mostrar ou esconder o número de celular

const nomeEmpresa = "Atacado"; // Nome da empresa
const logoUrl = "./assets/logo.jpg"; // URL do logo
const mostrarLogo = false; // Defina como true ou false para mostrar ou esconder o logo

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

let bonesPremiumProductList = [];

// Função para buscar e exibir os produtos da API Bones Premium
function fetchBonesPremiumProducts() {
  fetch("https://api.ecommerce.nextar.com/prod/api/products", options)
    .then((response) => response.json())
    .then((data) => {
      bonesPremiumProductList = data.list; // Salvar a lista de produtos
      displayProducts(bonesPremiumProductList); // Exibir produtos
    })
    .catch((err) =>
      console.error("Erro ao buscar produtos Bones Premium:", err)
    );
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
    namePara.classList.add("nome"); // Adiciona a classe "nome"

    // Adiciona os preços logo abaixo do nome do produto
    const priceContainer = document.createElement("div");

    // Controle para exibir o preço de varejo
    if (aparecerPrecoVarejo) {
      const priceVarejoPara = document.createElement("p");
      priceVarejoPara.textContent = `Varejo: R$${precoVarejo
        .toFixed(2)
        .replace(".", ",")}`;
      priceContainer.appendChild(priceVarejoPara);
    }

    // Controle para exibir o preço de atacado
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
    )}`; // URL para o WhatsApp
    contactButton.target = "_blank";
    contactButton.classList.add("btn", "btn-success", "mt-2", "mb-2");

    const whatsappIcon = document.createElement("i");
    whatsappIcon.classList.add("bi", "bi-whatsapp");

    contactButton.appendChild(whatsappIcon);
    contactButton.appendChild(document.createTextNode(" Entrar em Contato"));

    productDiv.appendChild(img);
    productDiv.appendChild(namePara);
    productDiv.appendChild(priceContainer); // Adiciona os preços abaixo do nome
    productDiv.appendChild(codePara);
    if (mostrarNumeroCelular) {
      productDiv.appendChild(contactButton); // Adiciona o botão de contato se a variável estiver true
    }

    container.appendChild(productDiv);
  });
}

// Configuração inicial quando a página carrega
document.addEventListener("DOMContentLoaded", () => {
  fetchBonesPremiumProducts(); // Buscar e exibir produtos ao carregar a página

  document.getElementById("bones-premium-btn").addEventListener("click", () => {
    fetchBonesPremiumProducts(); // Atualizar produtos ao clicar no botão "Bones Premium"
  });

  document.getElementById("search-input").addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredProducts = bonesPremiumProductList.filter((product) =>
      product.ProductName.toLowerCase().includes(searchTerm)
    );

    displayProducts(filteredProducts);
  });

  // Atualiza o HTML da página com o nome e o logo da empresa
  const logoContainer = document.querySelector(".logo");

  if (mostrarLogo) {
    const logoImg = logoContainer.querySelector("img");
    if (logoImg) {
      logoImg.src = logoUrl;
      logoImg.alt = nomeEmpresa;
    } else {
      const newLogoImg = document.createElement("img");
      newLogoImg.src = logoUrl;
      newLogoImg.alt = nomeEmpresa;
      newLogoImg.classList.add("img-fluid");
      logoContainer.prepend(newLogoImg);
    }
  } else {
    // Remove a logo se mostrarLogo for false
    const logoImg = logoContainer.querySelector("img");
    if (logoImg) {
      logoImg.remove();
    }
  }

  document.querySelector(".logo h1").textContent = nomeEmpresa;
});
