import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(supabaseUrl, supabaseKey);

function addToProjects(projects, data) {
    let a = document.createElement("p");

    let project = document.createElement("article");
    project.classList.add("project");

    let img = document.createElement("img")
    img.src = data["image"];

    let h3 = document.createElement("h3");
    h3.innerText = data["title"];

    project.appendChild(img);
    project.appendChild(h3);

    a.appendChild(project);

    projects.appendChild(a);
}


async function getProjectsRequest(projects) {
    enableLoader();
    const { data, error } = await supabase
        .from('hobbies')
        .select()
    disableLoader();
    for (let i=0; i < data.length; i++) {
        addToProjects(projects, data[i]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let projects = document.getElementById("projects-body");

    getProjectsRequest(projects);
});