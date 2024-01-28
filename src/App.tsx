import { useState } from "react";

export default function App(): JSX.Element {
    var [show, setShow] = useState(false);

    return (
        <div>
            <button onClick={() => setShow(!show)}>Toggle</button>
        </div>
    );
}
