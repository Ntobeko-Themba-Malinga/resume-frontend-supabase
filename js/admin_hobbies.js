import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', async () => {
    let { data: { user } } = await supabase.auth.getUser();
    redirectToLogin(user);

    let requestType = "POST";
    let tableBody = document.getElementById("projects-table-body");
    let projectTitleInput = document.getElementById("projects-title-input");
    let projectImageInput = document.getElementById("projects-image-url");
    let submitBtn = document.getElementById("projects-submit-btn");
    let ProjectId;

    function addProjectToTable(tableBody, data) {
        let tr = document.createElement("tr");
        let id = data["id"];

        let ProjectTitleId = document.createElement("td");
        ProjectTitleId.innerText = data["title"];
        ProjectTitleId.id = "title-" + id;

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
        tr.appendChild(ProjectImageTd);
        tr.appendChild(updateBtnTd);
        tr.appendChild(deleteBtnTd);

        tableBody.prepend(tr);

        updateBtn.addEventListener("click", () => {
            requestType = "PUT";
            ProjectId = id;
            projectTitleInput.value = data["title"];
            projectImageInput.value = data["image"];
        });

        deleteBtn.addEventListener("click", () => {
            ProjectId = id;
            deleteProjectsRequest();
        });
    }


    function updateProject(ProjectId, data) {
        let title = document.getElementById("title-" + ProjectId);
        let image = document.getElementById("git-image-" + ProjectId);

        title.innerText = data["title"];
        image.innerText = data["image"];

        projectTitleInput.value = "";
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
            .from('hobbies')
            .delete()
            .match({ id: ProjectId })
        disableLoader();

        if (error !== null) {
            alert(error);
        } else {
            deleteProject();
        }
    }


    async function putProjectsRequest(ProjectId, Project) {
        enableLoader();
        const { data, error } = await supabase
            .from('hobbies')
            .update(Project)
            .match({ id: ProjectId });
        disableLoader();

        if (error !== null) {
            alert(error);
        } else {
            updateProject(ProjectId, Project);
        }
    }


    async function postProjectsRequest(tableBody, Project) {
        enableLoader();
        const { data, error } = await supabase
            .from('hobbies')
            .insert([
                Project
            ]);
        disableLoader();

        if (error !== null) {
            alert(error);
        } else {
            addProjectToTable(tableBody, Project);
        }
    }


    async function getProjectsRequest(tableBody) {
        enableLoader();
        const { data, error } = await supabase
            .from('hobbies')
            .select()
        disableLoader();
        for (let i=0; i < data.length; i++) {
            addProjectToTable(tableBody, data[i]);
        }
    }

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();
       
        let title = projectTitleInput.value;
        let image = projectImageInput.value;

        if (title.trim().length !== 0
            && image.trim().length !== 0) {
            const Project = {
                title: title,
                image: image
            } 

            if (requestType === "POST") {
                postProjectsRequest(tableBody, Project);
            } else {
                putProjectsRequest(ProjectId, Project);
            }
        } else {
            alert("Make sure the title and Project level fields are not empty");
        }
    });
    getProjectsRequest(tableBody);
});
