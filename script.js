const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Shop-Code": "648669",
  },
  body: '{"filter":{"stockControl":true,"page":1,"perPage":500,"category":"","subCategory":"","search":null,"sort":{"ProductName":1},"onlyPromo":false}}',
};

fetch("https://api.ecommerce.nextar.com/prod/api/products", options)
  .then((response) => response.json())
  .then((data) => {
    // 'data' contém a resposta da API no formato JSON
    const productList = data.list; // Array de produtos

    // Selecionar o container onde os divs serão inseridos (supondo que você tenha um div com id 'product-container' no seu HTML)
    const container = document.getElementById("product-container");

    // Iterar sobre cada produto na lista
    productList.forEach((product) => {
      // Extrair as informações necessárias
      const productCode = product.ProductCode;
      const productName = product.ProductName;
      const productImg = product.ProductImg;

      // Construir a URL da imagem usando a base fornecida e o ProductImg específico
      const imgUrl = `https://storage.googleapis.com/nexapp-flutter.appspot.com/production/products/${productImg}`;

      // Criar elementos HTML
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");

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
  })
  .catch((err) => console.error(err));
