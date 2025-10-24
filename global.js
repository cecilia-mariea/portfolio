console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// nav bar
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'cv/', title: 'CV'},
    { url: 'https://github.com/cecilia-mariea', title:'GitHub Profile'},
    { url: 'contact/', title: 'Contact' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"                  // Local server
    : "/portfolio/";         // GitHub Pages repo name

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !url.startsWith('http') ? BASE_PATH + url : url;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }
    if (a.host != location.host) {
        a.target = "_blank";
    }
}

// color-scheme switch

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
            <option value="light">Light</option> 
            <option value="dark">Dark</option>
            <option value="light dark">OS Color Scheme</option>
		</select>
	</label>`,
);

let select = document.querySelector("select");

select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
});

if ("colorScheme" in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
}

// projects page
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(project, containerElement, headingLevel = 'h2') {
  if (containerElement == null) {
    throw new Error (`${containerElement} is invalid`)
  }
  let imgSrc = p.image;
  if (!imgSrc.startsWith('http')) {
  imgSrc = `${window.location.origin}/portfolio/${imgSrc.replace(/^\//, '')}`;
  }
  containerElement.innerHTML = '';
  for (let p of project) {
    const article = document.createElement('article');

    const headingElement = document.createElement(headingLevel)
    headingElement.textContent = p.title;
    article.appendChild(headingElement);
    article.innerHTML += ` 
    <img src="${imgSrc}" alt="${p.title}">
    <p>${p.description}</p>
    `; // append to innerHTML since we already added the heading
    containerElement.appendChild(article);
  }
}

export function countProjects(projectsContainer, projectsSelector = 'article', headingLevel = 'h1') {
  const headerElement = document.createElement('header')
  const count = projectsContainer.querySelectorAll(projectsSelector).length;
  const headingElement = document.createElement(headingLevel);
  headingElement.textContent = `${count} Projects`;
  document.body.insertBefore(headerElement, projectsContainer);
  headerElement.appendChild(headingElement);
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`)
}
