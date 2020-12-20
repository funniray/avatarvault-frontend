import useFetch from "fetch-suspense";

const baseurl = `http://localhost:3010`;

export default class Rest {
    static getCategories(){
        return useFetch(`${baseurl}/v1/categories`);
    }

    static getTags(query,page,limit) {
        query = encodeURIComponent(query);
        page = encodeURIComponent(page);
        limit = encodeURIComponent(limit);
        return useFetch(`${baseurl}/v1/tags?query=${query}&page=${page}&limit=${limit}`);
    }

    static searchObjects(category,tags,page,limit) {
        category = encodeURIComponent(category);
        tags = encodeURIComponent(JSON.stringify(tags));
        page = encodeURIComponent(page);
        limit = encodeURIComponent(limit);
        let url = `${baseurl}/v1/search?category=${category}&tags=${tags}&page=${page}&limit=${limit}`;
        return useFetch(url);
    }
}