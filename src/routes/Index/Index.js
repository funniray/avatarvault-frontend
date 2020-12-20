import {Link} from "react-router-dom";

export default function Index() {
    let url = `/search?tags=["kon"]&category=avatars`
    return (<>
        <p>This is the main index page owo</p>
        <Link to={url}>Search</Link>
    </>)
}