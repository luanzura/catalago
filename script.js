const perPage = 200; // Máximo permitido pela API
let productList = [];
let currentPage = 1;
let hasMorePages = true;

function fetchAllProducts() {
  if (!hasMorePages) {
    displayProducts(productList);
    return;
  }

  fetch(
    `https://proxy-nuvem.vercel.app/products?page=${currentPage}&per_page=${perPage}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Verifique a estrutura da resposta aqui
      if (Array.isArray(data)) {
        productList = productList.concat(
          data.map((product) => ({
            name: product.name.pt,
            image: product.images[0].src,
          }))
        );

        // Se a resposta tem menos itens do que per_page, é a última página
        hasMorePages = data.length === perPage;
        currentPage++;

        // Recursivamente buscar a próxima página
        fetchAllProducts();
      } else {
        console.error("Unexpected data format:", data);
        hasMorePages = false;
      }
    })
    .catch((err) => console.error("Fetch error:", err));
}

function displayProducts(products) {
  const container = document.getElementById("product-container");
  container.innerHTML = ""; // Limpar o container antes de exibir os produtos

  products.forEach((product) => {
    const productName = product.name;
    const productImg = product.image;

    const productDiv = document.createElement("div");
    productDiv.classList.add("col-md-4", "product");

    const img = document.createElement("img");
    img.src = productImg;
    img.alt = productName;

    img.addEventListener("click", () => {
      window.open(productImg, "_blank");
    });

    const namePara = document.createElement("p");
    namePara.textContent = productName;

    productDiv.appendChild(img);
    productDiv.appendChild(namePara);

    container.appendChild(productDiv);
  });
}

document.getElementById("search-input").addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );
  displayProducts(filteredProducts);
});

// Inicie a busca de produtos
fetchAllProducts();
