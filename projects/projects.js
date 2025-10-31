import { fetchJSON, renderProjects , countProjects} from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';


const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
countProjects(projectsContainer)

// D3 visualization of project creation years

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let colors = d3.scaleOrdinal(d3.schemeTableau10);

let svg = d3.select('svg')
let legend = d3.select('.legend');


function renderPieChart(projectsGiven) {

  // clear all svg paths, legend entries
  svg.selectAll('*').remove();
  legend.selectAll('*').remove();

   // populate data
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  let selectedIndex = -1;

  // populate chart with data
  arcs.forEach((arc, idx) => {

      svg
      .append('path')
      .attr('d',arc)
      .attr('fill', colors(idx))
      .on('click', () => {
    
        selectedIndex= selectedIndex === idx ? -1 : idx;
        
        svg
          .selectAll('path')
          .attr('class', (_,i) => (
              i ===  selectedIndex ? 'selected' : 'not_selected'
          ));

        legend
          .selectAll('li')
          .attr('class', (_,i) => (
            i === selectedIndex ? 'selected' : 'not_selected'
          ));

          if (selectedIndex === -1) {
            renderProjects(projects,projectsContainer);
          } else {
            let selectedYear = arcData[selectedIndex].data.label ;
            let filtered = projects.filter(p => p.year === selectedYear);
            renderProjects(filtered, projectsContainer);

          }

      });
  });

  // pie chart legend
  data.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
      .attr('class', 'legend_entry')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
  });
}

//search
let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;

  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  })

  renderProjects(filteredProjects, projectsContainer);
  renderPieChart(filteredProjects);

});

// initial load of pie chart
renderPieChart(projects);
