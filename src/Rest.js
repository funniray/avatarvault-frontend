export const baseurl = window.location.href.includes("localhost")?`http://localhost:3010`:'https://api.vault.requi.dev';


function getCategories(){
    return (`${baseurl}/v1/categories`);
}

function getTags(query,page,limit) {
    query = encodeURIComponent(query);
    page = encodeURIComponent(page);
    limit = encodeURIComponent(limit);
    return (`${baseurl}/v1/tags?query=${query}&page=${page}&limit=${limit}`);
}

function searchObjects(category,tags,page,limit) {
    category = encodeURIComponent(category);
    tags = encodeURIComponent(JSON.stringify(tags));
    page = encodeURIComponent(page);
    limit = encodeURIComponent(limit);
    let url = `${baseurl}/v1/search?category=${category}&tags=${tags}&page=${page}&limit=${limit}`;
    return (url);
}

function canUpload() {
    return `${baseurl}/v1/upload/canUpload`
}

function checkPass() {
    return `${baseurl}/v1/upload/checkPass`
}

function login() {
    return `${baseurl}/v1/user/login`
}

function register() {
    return `${baseurl}/v1/user/create`
}

export default {getCategories,getTags,searchObjects,canUpload,checkPass,baseurl}