import { useState } from "react";
import { flushSync } from "react-dom";
import { useImmer } from "use-immer";

import { faker } from "@faker-js/faker";

type Info = {
    username: string;
    age: number;
    isMarried: boolean;
};

function createInitialState(): Info {
    return {
        username: faker.person.firstName(),
        age: faker.number.int(),
        isMarried: faker.datatype.boolean(),
    };
}

export default function UseState(): JSX.Element {
    var [count, setCount] = useState<number>(0);
    var [info, setInfo] = useState<Info>({
        username: faker.person.firstName(),
        age: faker.number.int(),
        isMarried: faker.datatype.boolean(),
    });
    var [powerNum, setPowerNum] = useState<number>(2);
    var [domUrgency, setDomUrgency] = useState<number>(0);
    var [immerInfo, updateImmerInfo] = useImmer<Info>({
        username: faker.person.firstName(),
        age: faker.number.int(),
        isMarried: faker.datatype.boolean(),
    });

    // wrong way as this function is getting called every time the render occurs
    // React saves the initial state once and ignores it on the next renders.
    //
    // Although the result of createInitialState() is only used for the initial render,
    // you’re still calling this function on every render. This can be wasteful if it’s
    // creating large arrays or performing expensive calculations.
    //
    // var [info2, setInfo2] = useState<Info>(createInitialState());
    var [info2, setInfo2] = useState<Info>(() => createInitialState());

    return (
        <div>
            <h1>useState</h1>

            <section>
                <h2>Primitive type: number</h2>
                <p>{count}</p>
                <button onClick={handleCountIncrement}>Increment</button>
            </section>

            <section>
                <h2>Object</h2>
                <p>{JSON.stringify(info)}</p>
                <button onClick={handleInfoChange}>Change</button>
            </section>

            <section>
                <h2>Outside setter function</h2>
                <p>{powerNum}</p>
                <button onClick={raiseToPowerOf2}>
                    Raise to the power of 2
                </button>
            </section>

            <section>
                <h2>Avoid batch update</h2>
                <p>{domUrgency}</p>
                <button onClick={handleDomUrgency}>Don't batch</button>
            </section>

            <CannotCallSetterOfOtherComponentDuringRendering />

            <section>
                <h2>Immer</h2>
                <p>{JSON.stringify(immerInfo)}</p>
                <button onClick={handleImmerInfoChange}>Change</button>
            </section>

            <section>
                <h2>Settimeout</h2>
                <p>{JSON.stringify(info2)}</p>
                <button onClick={handleInfoChange2}>Change</button>
            </section>
        </div>
    );

    function handleInfoChange2(): void {
        setInfo2((prev) => {
            return { ...prev, username: faker.person.firstName() };
        });

        setTimeout(function () {
            // info2's value will be from the closure where this setTimeout was created
            // in order to get the latest value use useRef's current value
            console.log("Info 2", info2);
        }, 5000);
    }

    function handleImmerInfoChange(): void {
        updateImmerInfo((prev) => {
            var age = faker.number.int();
            console.log("age", age);
            prev.age = age;
        });
    }

    function handleDomUrgency(): void {
        // domUrgency updates only in the next render

        console.log("domUrgency", domUrgency);
        setDomUrgency((prev) => prev + 1);
        console.log("domUrgency", domUrgency);
        flushSync(() => {
            console.log("domUrgency", domUrgency);
            setDomUrgency((prev) => prev + 1);
        });
        console.log("domUrgency", domUrgency);
        setDomUrgency((prev) => prev + 1);
    }

    function raiseToPowerOf2(): void {
        setPowerNum(raiseToPowerOf2Helper);
    }

    function handleInfoChange(): void {
        setInfo((prev) => {
            var age = faker.number.int();
            console.log("age", age);
            return { ...prev, age: age };
        });

        setInfo((prev) => {
            var username = faker.person.firstName();
            console.log("username", username);
            return { ...prev, username: username };
        });
    }

    function handleCountIncrement(): void {
        // initialState: The value you want the state to be initially. It can
        // be a value of any type, but there is a special behavior for functions.
        // This argument is ignored after the initial render.
        //
        // If you pass a function as initialState, it will be treated as an initializer
        // function. It should be pure, should take no arguments, and should return
        // a value of any type. React will call your initializer function when initializing
        // the component, and store its return value as the initial state. See an example below.
        //
        // In Strict Mode, React will call your initializer function twice in order to
        // help you find accidental impurities. This is development-only behavior and does
        // not affect production. If your initializer function is pure (as it should be),
        // this should not affect the behavior. The result from one of the calls will be ignored.
        //
        // If you pass a function as nextState, it will be treated as an updater function. It
        // must be pure, should take the pending state as its only argument, and should return
        // the next state. React will put your updater function in a queue and re-render your
        // component. During the next render, React will calculate the next state by applying
        // all of the queued updaters to the previous state. See an example below.

        // Caveats
        //
        // 1. The set function only updates the state variable for the next render. If you read the
        // state variable after calling the set function, you will still get the old value that was
        // on the screen before your call.
        //
        // 2. If the new value you provide is identical to the current state, as determined by an Object.is
        // comparison, React will skip re-rendering the component and its children. This is an optimization.
        //  Although in some cases React may still need to call your component before skipping the children,
        //  it shouldn’t affect your code.
        //
        // 3. React batches state updates. It updates the screen after all the event handlers have run and
        // have called their set functions. This prevents multiple re-renders during a single event. In
        // the rare case that you need to force React to update the screen earlier, for example to access
        // the DOM, you can use flushSync.
        //
        // 4. Calling the set function during rendering is only allowed from within the currently rendering
        // component. React will discard its output and immediately attempt to render it again with the new
        // state. This pattern is rarely needed, but you can use it to store information from the previous
        // renders. See an example below.
        //
        // 5. In Strict Mode, React will call your updater function twice in order to help you find accidental
        // impurities. This is development-only behavior and does not affect production. If your updater
        // function is pure (as it should be), this should not affect the behavior. The result from one
        // of the calls will be ignored.

        // Calling the set function does not change the current state in the already executing code:
        // function handleClick() {
        //   setName('Robin');
        //   console.log(name); // Still "Taylor"!
        // }
        // It only affects what useState will return starting from the next render.

        // Here, a => a + 1 is your updater function. It takes the pending state and
        // calculates the next state from it.
        //
        // React puts your updater functions in a queue. Then, during the next render,
        // it will call them in the same order:
        // a => a + 1 will receive 42 as the pending state and return 43 as the next state.
        // a => a + 1 will receive 43 as the pending state and return 44 as the next state.
        // a => a + 1 will receive 44 as the pending state and return 45 as the next state.
        // There are no other queued updates, so React will store 45 as the current state in the end.
        //
        // By convention, it’s common to name the pending state argument for the first letter of
        // the state variable name, like a for age. However, you may also call it like prevAge or
        // something else that you find clearer.
        //
        // React may call your updaters twice in development to verify that they are pure.
        //

        // Is using an updater always preferred?
        //
        // You might hear a recommendation to always write code like setAge(a => a + 1) if
        // the state you’re setting is calculated from the previous state. There is no harm in
        // it, but it is also not always necessary.
        //
        // In most cases, there is no difference between these two approaches. React always
        // makes sure that for intentional user actions, like clicks, the age state variable
        // would be updated before the next click. This means there is no risk of a click handler
        // seeing a “stale” age at the beginning of the event handler.
        //
        // However, if you do multiple updates within the same event, updaters can be helpful.
        // They’re also helpful if accessing the state variable itself is inconvenient (you might
        //     run into this when optimizing re-renders).
        //
        // If you prefer consistency over slightly more verbose syntax, it’s reasonable to always
        // write an updater if the state you’re setting is calculated from the previous state. If
        // it’s calculated from the previous state of some other state variable, you might want to
        //  combine them into one object and use a reducer.

        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
        setCount((prev) => prev + 1);
    }
}

function raiseToPowerOf2Helper(prev: number) {
    return prev * prev;
}

// @ref - https://react.dev/reference/react/useState#storing-information-from-previous-renders
function CannotCallSetterOfOtherComponentDuringRendering(): JSX.Element {
    function App(): JSX.Element {
        const [count, setCount] = useState(0);
        const [, setT] = useState(0);
        return (
            <>
                <button onClick={() => setCount(count + 1)}>Increment</button>
                <button onClick={() => setCount(count - 1)}>Decrement</button>
                <CountLabel count={count} setT={setT} />
            </>
        );
    }

    function CountLabel({
        count,
        setT,
    }: {
        count: number;
        setT: React.Dispatch<React.SetStateAction<number>>;
    }) {
        const [prevCount, setPrevCount] = useState(count);
        const [trend, setTrend] = useState<string | null>(null);
        if (prevCount !== count) {
            setPrevCount(count);
            setT((prev) => prev + 1);
            setTrend(count > prevCount ? "increasing" : "decreasing");
        }
        return (
            <>
                <h1>{count}</h1>
                {trend && <p>The count is {trend}</p>}
            </>
        );
    }

    return (
        <section>
            <App />
        </section>
    );
}
