// URL del JSON
const URL = "https://japceibal.github.io/japflix_api/movies-data.json";

let peliculas = [];

// Cargar datos al inicio
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const resp = await fetch(URL);
    peliculas = await resp.json();
  } catch (error) {
    console.error("Error cargando películas:", error);
  }
});

// Referencias del DOM
const inputBuscar = document.getElementById("inputBuscar");
const btnBuscar = document.getElementById("btnBuscar");
const lista = document.getElementById("lista");

// Buscar películas
btnBuscar.addEventListener("click", () => {
  const query = inputBuscar.value.toLowerCase().trim();
  lista.innerHTML = "";

  if (query === "") return;

  const resultados = peliculas.filter((peli) =>
    peli.title.toLowerCase().includes(query) ||
    (peli.tagline && peli.tagline.toLowerCase().includes(query)) ||
    (peli.overview && peli.overview.toLowerCase().includes(query)) ||
    (peli.genres && peli.genres.join(" ").toLowerCase().includes(query))
  );

  if (resultados.length === 0) {
    lista.innerHTML = `<li class="list-group-item text-white bg-dark">No se encontraron resultados</li>`;
    return;
  }

  resultados.forEach((peli) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "bg-dark", "text-white");
    li.style.cursor = "pointer";

    li.innerHTML = `
      <h5>${peli.title}</h5>
      <p class="text-muted">${peli.tagline || ""}</p>
      <p>${renderStars(peli.vote_average)}</p>
    `;

    // Click en una película
    li.addEventListener("click", () => mostrarDetalle(peli));

    lista.appendChild(li);
  });
});

// Renderizar estrellas de rating
function renderStars(vote) {
  const estrellas = Math.round(vote / 2); // 10 → 5 estrellas
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= estrellas) {
      html += `<span class="fa fa-star checked text-warning"></span>`;
    } else {
      html += `<span class="fa fa-star text-secondary"></span>`;
    }
  }
  return html;
}

// Mostrar detalle superior
function mostrarDetalle(peli) {
  // Cerrar anterior si existe
  const old = document.querySelector("#detalle");
  if (old) old.remove();

  const detalle = document.createElement("div");
  detalle.id = "detalle";
  detalle.classList.add("container", "bg-secondary", "text-white", "p-3", "mb-3", "rounded");

  detalle.innerHTML = `
    <h3>${peli.title}</h3>
    <p>${peli.overview}</p>
    <p><strong>Géneros:</strong> ${peli.genres.join(" - ")}</p>

    <div class="dropdown mt-2">
      <button class="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown">
        Más información
      </button>
      <ul class="dropdown-menu">
        <li><span class="dropdown-item">Year: ${new Date(peli.release_date).getFullYear()}</span></li>
        <li><span class="dropdown-item">Runtime: ${peli.runtime} mins</span></li>
        <li><span class="dropdown-item">Budget: $${peli.budget}</span></li>
        <li><span class="dropdown-item">Revenue: $${peli.revenue}</span></li>
      </ul>
    </div>
  `;

  lista.parentElement.insertBefore(detalle, lista);
}
