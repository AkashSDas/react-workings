import { memo, useEffect, useMemo, useState } from "react";

// useMemo is a React Hook that lets you cache the result of a calculation between re-renders.

// You should only rely on useMemo as a performance optimization. If your code doesn’t
// work without it, find the underlying problem and fix it first. Then you may
// add useMemo to improve performance.

// React will not throw away the cached value unless there is a specific reason to do that.
// For example, in development, React throws away the cache when you edit the file of your component.
// Both in development and in production, React will throw away the cache if your component
// suspends during the initial mount. In the future, React may add more features that take
// advantage of throwing away the cache—for example, if React adds built-in support for virtualized
// lists in the future, it would make sense to throw away the cache for items that scroll out of the
// virtualized table viewport. This should be fine if you rely on useMemo solely as a performance
// optimization. Otherwise, a state variable or a ref may be more appropriate.

// https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere

// In JavaScript, a function () {} or () => {} always creates a different function, similar
// to how the {} object literal always creates a new object. Normally, this wouldn’t be a problem,
// but it means that ShippingForm props will never be the same, and your memo optimization won’t work.
// This is where useCallback comes in handy:
//
// By wrapping handleSubmit in useCallback, you ensure that it’s the same function between the
// re-renders (until dependencies change).

function update(setShow2: CallableFunction) {
    return function () {
        setShow2((s: boolean) => !s);
    };
}

export default function App(): JSX.Element {
    var [show, setShow] = useState(false);
    var [show2, setShow2] = useState(false);

    var performance = window.performance;

    // useEffect(update(setShow2), [show]);

    // no arguments
    var randomNum = useMemo(() => {
        console.log("[useMemo] randomNum");

        var now = performance.now();
        while (performance.now() - now < 1000) {
            // Artificially long execution time.
        }

        return Math.floor(Math.random() * (100 + 1));
    }, [show2]);

    // https://react.dev/reference/react/useMemo#memoizing-individual-jsx-nodes
    var MemoizedRandomNumDisplay = useMemo(
        () => <RandomDisplay randomNum={randomNum} />,
        [randomNum]
    );

    return (
        <div>
            <h2>Random number: {randomNum}</h2>

            <button onClick={() => setShow(!show)}>
                Toggle {show.toString()}
            </button>
            <button onClick={() => setShow2(!show2)}>Toggle 2</button>

            <RandomDisplay randomNum={randomNum} />
            {MemoizedRandomNumDisplay}
        </div>
    );
}

// By default, when a component re-renders, React re-renders all of its children recursively.

var RandomDisplay = memo(function RandomDisplay({
    randomNum,
}: {
    randomNum: number;
}) {
    console.log("[RandomDisplay] render");

    console.log("[RandomDisplay] randomNum", randomNum);
    return (
        <div>
            <h2>Random number: {randomNum}</h2>
        </div>
    );
});

// Optimizing a custom Hook:
// If you’re writing a custom Hook, it’s recommended to wrap any functions that it returns into useCallback:
// This ensures that the consumers of your Hook can optimize their own code when needed.
