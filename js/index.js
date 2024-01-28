const supabaseUrl = 'https://kqzxjuqwkajpfbuttfbx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxenhqdXF3a2FqcGZidXR0ZmJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY0NTIwMzIsImV4cCI6MjAyMjAyODAzMn0.ItvYaa_HDjljkb2IvhlqPoWkCUARRLSYXOXK7dxoZXA';

function enableLoader() {
    let loader = document.getElementById("loading");
    loader.style.display = "flex";
}


function disableLoader() {
    let loader = document.getElementById("loading");
    loader.style.display = "none";
}

function redirectToLogin(data) {
    if (data === null) {
        window.location.replace("/login.html");
    }
}
