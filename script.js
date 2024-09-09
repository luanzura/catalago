const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "shop-code": "648669",
    "origin": "https://meucomercio.com.br"
  },
  body: JSON.stringify({
    filter: {
      category: "",
      subCategory: "",
      search: "",
      lowStock: false,
      stockControl: true,
      sort: { ProductName: 1 },
      page: 1,
      perPage: 300,
      onlyPromo: false,
      projection: [
        "ProductId",
        "ShopCode",
        "BarCode",
        "ProductCode",
        "ProductCode2",
        "Brand",
        "Category",
        "CategorySlug",
        "SubCategory",
        "SubCategorySlug",
        "CurrentStock",
        "Photos",
        "ProductImg",
        "ProductName",
        "ProductUId",
        "SalePrice",
        "PromoActive",
        "PromoEndAt",
        "PromoInitAt",
        "PromoSalePrice",
        "ProductDescr",
        "Unit",
        "tax",
        "TaxID",
        "TaxUID",
        "storage",
        "isFractioned",
        "productStockControl"
      ],
      sortFilter: "A-Z"
    }
  })
};

let productList = [];

function fetchProducts(page = 1) {
  fetch(`https://api.ecommerce.nextar.com/prod/api/products`, options)
    .then((response) => response.json())
    .then((data) => {
      productList = productList.concat(data.list); // Adicionar produtos ao array
      displayProducts(productList); // Exibir produtos
      // Adicionar lógica para paginação se necessário
    })
    .catch((err) => console.error(err));
}

function displayProducts(products) {
  const container = document.getElementById("product-container");
  container.innerHTML = ""; // Limpar o container antes de exibir os produtos

  products.forEach((product) => {
    const productId = product.ProductId; // ID do produto
    const productName = product.ProductName; // Nome do produto
    const productImg = product.Photos[0]?.url || "placeholder.jpg"; // Primeira imagem ou um placeholder

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
    product.ProductName.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts); // Exibir produtos filtrados
});

// Buscar produtos ao carregar a página
fetchProducts();
