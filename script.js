const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Shop-Code": "648669",
  },
  body: '{"filter":{"stockControl":true,"page":1,"perPage":500,"category":"","subCategory":"","search":null,"sort":{"ProductName":1},"onlyPromo":false}}',
};

let productList = [];

fetch("https://api.ecommerce.nextar.com/prod/api/products", options)
  .then((response) => response.json())
  .then((data) => {
    productList = data.list; // Salvar a lista de produtos
    displayProducts(productList); // Exibir produtos inicialmente
  })
  .catch((err) => console.error(err));

function displayProducts(products) {
  const container = document.getElementById("product-container");
  container.innerHTML = ""; // Limpar o container antes de exibir os produtos

  products.forEach((product) => {
    // Extrair as informações necessárias
    const productCode = product.ProductCode;
    const productName = product.ProductName;
    const productImg = product.ProductImg;

    // Construir a URL da imagem usando a base fornecida e o ProductImg específico
    const imgUrl = `https://storage.googleapis.com/nexapp-flutter.appspot.com/production/products/${productImg}`;

    // Criar elementos HTML
    const productDiv = document.createElement("div");
    productDiv.classList.add("col-md-4", "product");

    const img = document.createElement("img");
    img.src = imgUrl;
    img.alt = productName;

    // Adicionar evento de clique na imagem para abrir a imagem em uma nova aba
    img.addEventListener("click", () => {
      window.open(imgUrl, "_blank");
    });

    const namePara = document.createElement("p");
    namePara.textContent = productName;

    const codePara = document.createElement("p");
    codePara.textContent = `Código do produto: ${productCode}`;

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
