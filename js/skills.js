import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(supabaseUrl, supabaseKey);

function addToSkills(skills, data) {
    let li = document.createElement("li");

    let pSkill = document.createElement("p");
    pSkill.classList.add("skill");
    pSkill.innerText = data["title"]
    
    let pLevel = document.createElement("p"); 
    pLevel.classList.add("level");
    pLevel.innerText = data["level"] + "/5";

    li.appendChild(pSkill);
    li.appendChild(pLevel);

    skills.appendChild(li);
}

async function getSkillsRequest(skills) {
    enableLoader();
    const { data, error } = await supabase
        .from('skill')
        .select()
        disableLoader();
    disableLoader();

    for (let i=0; i < data.length; i++) {
        addToSkills(skills, data[i]);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let skills = document.getElementById("skills");

    getSkillsRequest(skills);
});