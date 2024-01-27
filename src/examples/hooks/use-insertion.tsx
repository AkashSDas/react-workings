// - Effects only run on the client. They don’t run during server rendering.
// - IMPORTANT: You can’t update state from inside useInsertionEffect.
// - IMPORTANT: By the time useInsertionEffect runs, refs are not attached yet.
//
// - IMPORTANT: useInsertionEffect may run either before or after the DOM has been updated.
// You shouldn’t rely on the DOM being updated at any particular time.
//
// - Unlike other types of Effects, which fire cleanup for every Effect and then
// setup for every Effect, useInsertionEffect will fire both cleanup and setup one
// component at a time. This results in an “interleaving” of the cleanup and setup
// functions.

import {
    useEffect,
    useInsertionEffect,
    useLayoutEffect,
    useState,
} from "react";

export default function App(): JSX.Element {
    var [show, setShow] = useState(false);

    return (
        <div>
            <button onClick={() => setShow(!show)}>Toggle</button>
            {show && <Child />}
            {show && <Child2 />}
        </div>
    );
}

function Child(): JSX.Element {
    var [show, setShow] = useState(false);

    useInsertionEffect(function () {
        console.log("[insertion 1]");

        return function () {
            console.log("[destruction 1]");
        };
    });

    useInsertionEffect(function () {
        console.log("[insertion 11]");

        return function () {
            console.log("[destruction 11]");
        };
    });

    useLayoutEffect(function () {
        console.log("[effect 1]");

        return function () {
            console.log("[effect cleanup 1]");
        };
    });

    useLayoutEffect(function () {
        console.log("[effect 11]");

        return function () {
            console.log("[effect cleanup 11]");
        };
    });

    useEffect(function () {
        console.log("[*effect 1]");

        return function () {
            console.log("[*effect cleanup 1]");
        };
    });

    return (
        <div>
            <h2>Child</h2>
            <button onClick={() => setShow(!show)}>Toggle</button>
        </div>
    );
}

function Child2(): JSX.Element {
    var [show, setShow] = useState(false);

    useInsertionEffect(function () {
        console.log("[insertion 2]");

        return function () {
            console.log("[destruction 2]");
        };
    });

    useLayoutEffect(function () {
        console.log("[effect 2]");

        return function () {
            console.log("[effect cleanup 2]");
        };
    });

    return (
        <div>
            <h2>Child</h2>
            <button onClick={() => setShow(!show)}>Toggle</button>
        </div>
    );
}
