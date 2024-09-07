const options = {
  method: "GET",
  headers: {
    "x-rr-store-id": "dc148d1b-15cb-4489-8762-8665a0b37970",
  },
};

let productList = [];

function fetchProducts(page = 1) {
  fetch(`https://api.rediredi.com/inventory/storefront/items?sortBy=title.asc&perPage=250&page=${page}&query=&filterBy=quantityAvailable%3A%3E0`, options)
    .then((response) => response.json())
    .then((data) => {
      productList = productList.concat(data.data); // Adicionar produtos ao array
      displayProducts(productList); // Exibir produtos
      if (data.nextPage) { // Verificar se há uma próxima página
        fetchProducts(data.nextPage); // Buscar próxima página
      }
    })
    .catch((err) => console.error(err));
}

function displayProducts(products) {
  const container = document.getElementById("product-container");
  container.innerHTML = ""; // Limpar o container antes de exibir os produtos

  products.forEach((product) => {
    // Extrair as informações necessárias
    const productId = product.baseVariant.sku; // Usar o 'sku' como ID
    const productName = product.baseVariant.title; // Usar 'title' como nome
    const productImg = product.pictures[0]; // Usar a primeira imagem da lista 'pictures'

    // Criar elementos HTML
    const productDiv = document.createElement("div");
    productDiv.classList.add("col-md-4", "product");

    const img = document.createElement("img");
    img.src = productImg;
    img.alt = productName;
    img.classList.add("img-fluid"); // Adicionar classe para responsividade

    // Adicionar evento de clique na imagem para abrir a imagem em uma nova aba
    img.addEventListener("click", () => {
      window.open(productImg, "_blank");
    });

    const namePara = document.createElement("p");
    namePara.textContent = productName;

    const codePara = document.createElement("p");
    codePara.textContent = `Código do produto: ${productId}`;

    // Adicionar elementos ao div do produto
    productDiv.appendChild(img);
    productDiv.appendChild(namePara);
    productDiv.appendChild(codePara);

    // Adicionar o div do produto ao container no HTML
    container.appendChild(productDiv);
  });
}

// Adicionar evento de input no campo de pesquisa
document.getElementById("search-input").addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredProducts = productList.filter((product) =>
    product.baseVariant.title.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts); // Exibir produtos filtrados
});

// Buscar produtos ao carregar a página
fetchProducts();
