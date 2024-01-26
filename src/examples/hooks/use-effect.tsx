// By default, when you read a reactive value from an Effect, you have to add it as
// a dependency. This ensures that your Effect “reacts” to every change of that value.
// For most dependencies, that’s the behavior you want.

// TODO: Explore useEffectEvent

import { type EffectCallback, useEffect, useState } from "react";

export default function App(): JSX.Element {
    var [urlChanged, setUrlChanged] = useState<boolean>(false);
    var [count, setCount] = useState<number>(0);

    function log(count: number, urlChanged: boolean) {
        console.log(count, urlChanged);
    }

    // useEffect(
    //     function shouldDo() {
    //         log(count, urlChanged);
    //     },
    //     [count, urlChanged]
    // );

    useEffect(
        function shouldNotDo() {
            log(count, urlChanged);
        },
        [urlChanged]
    );

    // Solution to react to urlChanged without having count as a dependency
    // is useEffectEvent

    useEffect(function orderOfCalls() {
        console.log("INIT");

        return () => {
            console.log("END");
        };
    }, []);

    console.log("RENDER");
    return (
        <div>
            <h1>useEffect</h1>
            <button onClick={toggleUrlChanged}>Toggle Url Changed</button>
            <button onClick={increment}>Increment</button>
        </div>
    );

    function toggleUrlChanged() {
        setUrlChanged((p) => !p);
    }

    function increment() {
        setCount((p) => p + 1);
    }
}

function BasicExample(): JSX.Element {
    var [show, setShow] = useState<boolean>(true);

    return (
        <div>
            <button onClick={toggle}>Toggle</button>
            {show && <Child />}
        </div>
    );

    function toggle() {
        setShow((p) => !p);
    }
}

function Child(): JSX.Element {
    var [dep, setDep] = useState<boolean>(true);

    useEffect(
        function (): ReturnType<EffectCallback> {
            console.log("Child mounted", dep);

            return function () {
                console.log("Child unmounted", dep);
            };
        },
        [dep]
    );

    return (
        <div>
            <h2>Child</h2>
            <button onClick={toggleDep}>Toggle Dep</button>
        </div>
    );

    function toggleDep() {
        setDep((p) => !p);
    }
}
