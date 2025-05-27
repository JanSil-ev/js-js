const text = document.querySelector(".input");
const autocomplete = document.querySelector(".autocomplet");
const cards = document.querySelector(".cards");

const debounce = (fn, debounceTime) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), debounceTime);
  };
};

const createCard = (repoData) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
        <div class="card-content">
            <p>Name: ${repoData.name}</p>
            <p>Owner: ${repoData.owner.login}</p>
            <p>Stars: ${repoData.stargazers_count}</p>
            <button class="remove-btn">X</button>
        </div>
    `;

  card.querySelector(".remove-btn").addEventListener("click", () => {
    card.remove();
  });

  cards.appendChild(card);
};

const getPost = async (url) => {
  autocomplete.innerHTML = "";

  if (!url.trim()) return;

  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${url}`,
      {
        headers: { "X-GitHub-Api-Version": "2022-11-28" },
      }
    );
    const data = await response.json();
    const repos = data.items.slice(0, 5);

    if (repos.length === 0) {
      autocomplete.innerHTML = '<div class="no-results">No results found</div>';
      return;
    }

    repos.forEach((repo) => {
      const element = document.createElement("div");
      element.className = "choice";
      element.textContent = repo.name;
      element.addEventListener("click", () => {
        createCard(repo);
        text.value = "";
        autocomplete.innerHTML = "";
      });

      autocomplete.appendChild(element);
    });
  } catch (error) {
    console.error("Error:", error);
    autocomplete.innerHTML = '<div class="error">Error fetching data</div>';
  }
};

const debounceHandle = debounce(handleInput, 500);
text.addEventListener("input", debounceHandle);

function handleInput(e) {
  getPost(e.target.value.trim());
}
