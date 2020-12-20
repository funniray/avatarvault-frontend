import {Redirect} from 'react-router-dom';

export default function Index() {
    return (<>
        <p>I have nothing.</p>
        <Redirect to="/search"/>
    </>)
}