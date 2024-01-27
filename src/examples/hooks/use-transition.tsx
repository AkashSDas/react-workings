// useTransition is a React Hook that lets you update the state without blocking the UI.

// Call useTransition at the top level of your component to mark some state updates as transitions.

// - useTransition is a Hook, so it can only be called inside components or custom Hooks. If you need to start a transition somewhere else (for example, from a data library), call the standalone startTransition instead.
// - You can wrap an update into a transition only if you have access to the set function of that state. If you want to start a transition in response to some prop or a custom Hook value, try useDeferredValue instead.
// - The function you pass to startTransition must be synchronous. React immediately executes this function, marking all state updates that happen while it executes as transitions. If you try to perform more state updates later (for example, in a timeout), they won’t be marked as transitions.
// - A state update marked as a transition will be interrupted by other state updates. For example, if you update a chart component inside a transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input update.
// - Transition updates can’t be used to control text inputs.
// - If there are multiple ongoing transitions, React currently batches them together. This is a limitation that will likely be removed in a future release.

import { memo, useState, useTransition } from "react";

export default function App(): JSX.Element {
    var [isPending, startTransition] = useTransition();
    var [show, setShow] = useState(false);

    return (
        <div>
            <button onClick={handleClick}>Toggle</button>
            {isPending ? "Loading..." : null}

            <br />
            <hr />
            <br />

            <Tabs />
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

function Tabs(): JSX.Element {
    var [tab, setTab] = useState(1);
    var [isPending, startTransition] = useTransition();

    function slow__handleClick(tabNum: number): () => void {
        return function () {
            setTab(tabNum);
        };
    }

    function fast__handleClick(tabNum: number): () => void {
        return function () {
            startTransition(() => {
                setTab(tabNum);
            });
        };
    }

    return (
        <section>
            {/* <button onClick={slow__handleClick(1)}>Tab 1</button>
            <button onClick={slow__handleClick(2)}>Tab 2</button>
            <button onClick={slow__handleClick(3)}>Tab 3</button> */}

            <button onClick={fast__handleClick(1)}>Tab 1</button>
            <button onClick={fast__handleClick(2)}>Tab 2</button>
            <button onClick={fast__handleClick(3)}>Tab 3</button>
            {isPending ? "Loading..." : null}

            {tab === 1 ? <Tab1 /> : null}
            {tab === 2 ? <Tab2 /> : null}
            {tab === 3 ? <Tab3 /> : null}
        </section>
    );
}

function Tab1(): JSX.Element {
    return <p>Tab 1</p>;
}

var Tab2 = memo(function Tab2(): JSX.Element {
    // This deferring won't work if below code is uncommented
    // var startTime = performance.now();
    // while (performance.now() - startTime < 500) {
    //     // Do nothing for 1 ms per item to emulate extremely slow code
    // }

    var items: JSX.Element[] = [];
    for (let i = 0; i < 500; i++) {
        items.push(<SlowPost key={i} index={i} />);
    }

    return <ul className="items">{items}</ul>;
});

function SlowPost({ index }: { index: number }): JSX.Element {
    var startTime = performance.now();
    while (performance.now() - startTime < 1) {
        // Do nothing for 1 ms per item to emulate extremely slow code
    }

    return <li className="item">Post #{index + 1}</li>;
}

function Tab3(): JSX.Element {
    return <p>Tab 3</p>;
}
