// useDeferredValue is a React Hook that lets you defer updating a part of the UI.

// useDeferredValue(value):
// Call useDeferredValue at the top level of your component to get a deferred version of that value.

import { memo, useState, useTransition } from "react";

export default function App(): JSX.Element {
    var [isPending, startTransition] = useTransition();
    var [show, setShow] = useState(false);

    return (
        <div>
            <button onClick={handleClick}>Toggle</button>
            {isPending ? "Loading..." : null}
        </div>
    );

    function handleClick(): void {
        // scope: A function that updates some state by calling one or more set functions.
        // React immediately calls scope with no parameters and marks all state updates scheduled
        // synchronously during the scope function call as transitions. They will be non-blocking
        // and will not display unwanted loading indicators.
        startTransition(() => {
            setShow(!show);
        });
    }
}
