import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    let { data: { user } } = await supabase.auth.getUser();
    redirectToLogin(user);

    const apiEndpoint = "/api/v1/projects";
    let requestType = "POST";
    let tableBody = document.getElementById("projects-table-body");
    let projectTitleInput = document.getElementById("projects-title-input");
    let projectGitRepoInput = document.getElementById("projects-git-url");
    let projectImageInput = document.getElementById("projects-image-url");
    let submitBtn = document.getElementById("projects-submit-btn");
    let token;
    let ProjectId;

    function addProjectToTable(tableBody, data) {
        let tr = document.createElement("tr");
        let id = data["id"];

        let ProjectTitleId = document.createElement("td");
        ProjectTitleId.innerText = data["title"];
        ProjectTitleId.id = "title-" + id;

        let ProjectLevelTd = document.createElement("td");
        ProjectLevelTd.innerText = data["url"];
        ProjectLevelTd.id = "git-repo-" + id;

        let ProjectImageTd = document.createElement("td");
        ProjectImageTd.innerText = data["image"];
        ProjectImageTd.id = "git-image-" + id;

        let updateBtnTd = document.createElement("td");
        let updateBtn = document.createElement("button");
        updateBtn.classList.add("update-btn");
        updateBtn.id = "update-" + id;
        updateBtn.innerText = "UPDATE";
        updateBtnTd.appendChild(updateBtn);

        let deleteBtnTd = document.createElement("td");
        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-btn");
        deleteBtn.id = "delete-" + id;
        deleteBtn.innerText = "DELETE";
        deleteBtnTd.appendChild(deleteBtn);

        tr.appendChild(ProjectTitleId);
        tr.appendChild(ProjectLevelTd);
        tr.appendChild(ProjectImageTd);
        tr.appendChild(updateBtnTd);
        tr.appendChild(deleteBtnTd);

        tableBody.prepend(tr);

        updateBtn.addEventListener("click", () => {
            requestType = "PUT";
            ProjectId = id;
            projectTitleInput.value = data["title"];
            projectGitRepoInput.value = data["url"];
            projectImageInput.value = data["image"];
        });

        deleteBtn.addEventListener("click", () => {
            ProjectId = id;
            deleteProjectsRequest();
        });
    }


    function updateProject(ProjectId, data) {
        let title = document.getElementById("title-" + ProjectId);
        let git = document.getElementById("git-repo-" + ProjectId);
        let image = document.getElementById("git-image-" + ProjectId);

        title.innerText = data["title"];
        git.innerText = data["url"];
        image.innerText = data["image"];

        projectTitleInput.value = "";
        projectGitRepoInput.value = "";
        projectImageInput.value = "";
        requestType = "POST";
    }


    function deleteProject() {
        let ProjectDeleteBtn = document.getElementById("delete-" + ProjectId);

        ProjectDeleteBtn.parentElement.parentElement.remove();
        requestType = "POST";
    }


    async function deleteProjectsRequest() {
        enableLoader();
        const { data, error } = await supabase
            .from('project')
            .delete()
            .match({ id: ProjectId })
        disableLoader();

        if (error !== null) {
            alert(error);
        } else {
            deleteProject();
        }
    }


    async function putProjectsRequest(project) {
        enableLoader();
        const { data, error } = await supabase
            .from('project')
            .update(project)
            .match({ id: ProjectId });
        disableLoader();

        if (error !== null) {
            alert(error);
        } else {
            updateProject(ProjectId, project);
        }
    }


    async function postProjectsRequest(tableBody, project) {
        enableLoader();
        const { data, error } = await supabase
            .from('project')
            .insert([
                project
            ]);
        disableLoader();

        if (error !== null) {
            alert(error);
        } else {
            addProjectToTable(tableBody, project);
        }
    }


    async function getProjectsRequest(tableBody) {
        enableLoader();
        const { data, error } = await supabase
            .from('project')
            .select()
            disableLoader();
        disableLoader();

        if (error !== null) {
            alert(error);
        } else {
            for (let i=0; i < data.length; i++) {
                addProjectToTable(tableBody, data[i]);
            }
        }
    }

    token = localStorage.getItem('user');

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
       
        let title = projectTitleInput.value;
        let url = projectGitRepoInput.value;
        let image = projectImageInput.value;

        if (title.trim().length !== 0
            && url.trim().length !== 0
            && image.trim().length !== 0) {
            const Project = {
                title: title,
                url: url,
                image: image
            } 

            if (requestType === "POST") {
                postProjectsRequest(tableBody, Project);
            } else {
                putProjectsRequest(Project);
            }
        } else {
            alert("Make sure the title and Project level fields are not empty");
        }
    });
    getProjectsRequest(tableBody);
});
