// You can mutate the ref.current property. Unlike state, it is mutable. However, if
// it holds an object that is used for rendering (for example, a piece of your state),
// then you shouldn’t mutate that object.
//
// Do not write or read ref.current during rendering, except for initialization. This
// makes your component’s behavior unpredictable.
//
// NOTE: In Strict Mode, React will call your component function twice in order to help
// you find accidental impurities. This is development-only behavior and does not
// affect production. Each ref object will be created twice, but one of the versions
// will be discarded. If your component function is pure (as it should be), this should
// not affect the behavior.
//
// By using a ref, you ensure that:
// - You can store information between re-renders (unlike regular variables, which reset on every render).
// - Changing it does not trigger a re-render (unlike state variables, which trigger a re-render).
// - The information is local to each copy of your component (unlike the variables outside, which are shared).
//
// IMPORTANT:
// Do not write or read ref.current during rendering.
// React expects that the body of your component behaves like a pure function:
// - If the inputs (props, state, and context) are the same, it should return exactly the same JSX.
// - Calling it in a different order or with different arguments should not affect the results of other calls.
// Reading or writing a ref during rendering breaks these expectations.
// If you have to read or write something during rendering, use state instead.
// When you break these rules, your component might still work, but most of the newer features
// we’re adding to React will rely on these expectations. Read more about keeping your components pure.
//
// After React creates the DOM node and puts it on the screen, React will set the current property of
// your ref object to that DOM node. React will set the current property back to null when the node
// is removed from the screen.
//
// React saves the initial ref value once and ignores it on the next renders.

import { forwardRef, useEffect, useRef, useState } from "react";

export default function App(): JSX.Element {
    var ref = useRef<HTMLInputElement>(null);

    return (
        <div>
            <input type="text" ref={ref} />
            <button onClick={focusOnInput}>Focus</button>
            <CustomTextInput ref={ref} />
        </div>
    );

    // A pattern to ensure that ref.current is not null
    function getInputRef(): HTMLInputElement {
        if (ref.current === null) {
            throw new Error("Input ref is null");
        }

        return ref.current;
    }

    function focusOnInput(): void {
        var currentRef = getInputRef();
        currentRef.focus();
        currentRef.placeholder = "Hello";

        // ref.current?.focus();
        // ref.current!.placeholder = "Hello";
    }
}

var CustomTextInput = forwardRef(function CustomTextInput(
    props: Record<string, unknown>,
    ref: React.Ref<HTMLInputElement>
) {
    return (
        <div>
            <input type="text" ref={ref} />
        </div>
    );
});

function RefExample(): JSX.Element {
    var countRef = useRef<number>(0);
    var [count, setCount] = useState<number>(0);

    useEffect(
        function () {
            countRef.current += 1;
            console.log("[useEffect] ", countRef.current);
        },
        [count]
    );

    countRef.current += 1;
    console.log("[render] ", countRef.current);

    return (
        <div>
            <h1>Hood morning {countRef.current}</h1>
            <button
                onClick={() =>
                    setCount((p) => {
                        console.log("[setCount]");
                        return p + 1;
                    })
                }
            >
                Count: {count}
            </button>
        </div>
    );
}
