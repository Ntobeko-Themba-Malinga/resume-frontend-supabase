import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(supabaseUrl, supabaseKey);

let contactIds = [];
let token;

function contactIdExist(contactId) {
    for (let i=0; i < contactIds.length; i++) {
        if (contactIds[i] === contactId) {
            return true;
        }
    }
    return false;
}

function addContactToTable(tableBody, data) {
    let tr = document.createElement("tr");
    let id = data["id"];

    let add = !contactIdExist(id);

    if (add) {
        contactIds.push(id);
        let dateTd = document.createElement("td");
        dateTd.innerText = data["date"];

        let nameTd = document.createElement("td");
        nameTd.innerText = data["name"];

        let emailTd = document.createElement("td");
        emailTd.innerText = data["email"];

        let messageTd = document.createElement("td");
        messageTd.innerText = data["message"];

        tr.appendChild(dateTd);
        tr.appendChild(nameTd);
        tr.appendChild(emailTd);
        tr.appendChild(messageTd);

        tableBody.prepend(tr);
    }
} 

async function getContactRequest(tableBody) {
    const { data, error } = await supabase
        .from('contact')
        .select();

    for (let i=0; i < data.length; i++) {
        addContactToTable(tableBody, data[i]);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    let { data: { user } } = await supabase.auth.getUser();
    redirectToLogin(user);

    let tableBody = document.getElementById("contacts-table-body");

    token = localStorage.getItem('user');
    enableLoader();
    getContactRequest(tableBody);
    disableLoader();

    setInterval(() => {
        getContactRequest(tableBody);
    }, 2000);
});