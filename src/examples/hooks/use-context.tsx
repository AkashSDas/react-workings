// - Create a context. (You can call it LevelContext, since it’s for the heading level.)
// - Use that context from the component that needs the data. (Heading will use LevelContext.)
// - Provide that context from the component that specifies the data. (Section will provide LevelContext.)

// Provider:
// This tells React: “if any component inside this <Section> asks for LevelContext,
// give them this level.” The component will use the value of the nearest <LevelContext.Provider>
// in the UI tree above it.

// Context lets you write components that “adapt to their surroundings” and display
// themselves differently depending on where (or, in other words, in which context) they
// are being rendered.

// 1. In React, the only way to override some context coming from above is to wrap children
// into a context provider with a different value.
//
// 2. Different React contexts don’t override each other. Each context that you make with
// createContext() is completely separate from other ones, and ties together components
// using and providing that particular context. One component may use or provide many different
// contexts without a problem.

// Before you use context
//
// Context is very tempting to use! However, this also means it’s too easy to overuse it.
// Just because you need to pass some props several levels deep doesn’t mean you should put
// that information into context.
//
// Here’s a few alternatives you should consider before using context:
//
// 1. Start by passing props. If your components are not trivial, it’s not unusual to pass a
// dozen props down through a dozen components. It may feel like a slog, but it makes it very
// clear which components use which data! The person maintaining your code will be glad you’ve
// made the data flow explicit with props.
//
// 2. Extract components and pass JSX as children to them. If you pass some data through
// many layers of intermediate components that don’t use that data (and only pass it further
// down), this often means that you forgot to extract some components along the way.
// For example, maybe you pass data props like posts to visual components that don’t use
// them directly, like <Layout posts={posts} />. Instead, make Layout take children as a
// prop, and render <Layout><Posts posts={posts} /></Layout>. This reduces the number of
// layers between the component specifying the data and the one that needs it.
//
// If neither of these approaches works well for you, consider context.

// IMPORTANT: Context is not limited to static values. If you pass a different value on the next
// render, React will update all the components reading it below! This is why context
// is often used in combination with state.
//
// In general, if some information is needed by distant components in different parts of
// the tree, it’s a good indication that context will help you.

// useContext Return:
// useContext returns the context value for the calling component. It is determined as
// the value passed to the closest SomeContext.Provider above the calling component in the
// tree. If there is no such provider, then the returned value will be the defaultValue
// you have passed to createContext for that context. The returned value is always up-to-date.
// React automatically re-renders components that read some context if it changes.

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useReducer,
    useState,
} from "react";

var CountContext = createContext<{
    state: number;
    dispatch: (action: string) => void;
}>({
    state: 0,
    dispatch: () => {},
});

function reducer(state: number, action: string): number {
    switch (action) {
        case "increment":
            return state + 1;
        case "decrement":
            return state - 1;
        default:
            throw new Error();
    }
}

export default function App(): JSX.Element {
    var [state1, dispatch1] = useReducer(reducer, 0);
    var [state2, dispatch2] = useReducer(reducer, 0);
    var [state3, dispatch3] = useReducer(reducer, 0);

    return (
        <div>
            <CountContext.Provider
                value={{ state: state1, dispatch: dispatch1 }}
            >
                <DisplayCount />
                <UpdateCount />
            </CountContext.Provider>

            <CountContext.Provider
                value={{ state: state2, dispatch: dispatch2 }}
            >
                <DisplayCount />
                <UpdateCount />

                {/* Overriding context */}
                <CountContext.Provider
                    value={{ state: state1, dispatch: dispatch1 }}
                >
                    <DisplayCount />
                    <UpdateCount />
                </CountContext.Provider>
            </CountContext.Provider>

            <CountContext.Provider
                value={{ state: state3, dispatch: dispatch3 }}
            >
                <DisplayCountOld />
                <UpdateCount />
            </CountContext.Provider>

            <br />
            <hr />
            <br />

            <CounterApp />
        </div>
    );
}

function UpdateCount(): JSX.Element {
    var { dispatch } = useContext(CountContext);

    return <button onClick={() => dispatch("increment")}>Increment</button>;
}

function DisplayCount(): JSX.Element {
    var { state } = useContext(CountContext);

    return <div>The current count is {state}</div>;
}

function DisplayCountOld(): JSX.Element {
    return (
        <CountContext.Consumer>
            {({ state }) => <div>The current count is {state}</div>}
        </CountContext.Consumer>
    );
}

// Optimizing re-renders when passing objects and functions (IMPORTANT: NOT WORKING IN THIS EXAMPLE)
//
// Here, the context value is a JavaScript object with two properties, one of which is
// a function. Whenever MyApp re-renders (for example, on a route update), this will be
// a different object pointing at a different function, so React will also have to re-render
// all components deep in the tree that call useContext(AuthContext).
//
// In smaller apps, this is not a problem. However, there is no need to re-render them
// if the underlying data, like currentUser, has not changed. To help React take advantage
// of that fact, you may wrap the login function with useCallback and wrap the object creation
// into useMemo. This is a performance optimization:

var CounterAppContext = createContext({
    count: 0,
    increment: () => {},
});

function CounterApp(): JSX.Element {
    var [count, setCount] = useState(0);
    var [count2, setCount2] = useState(0);

    var increment = useCallback(() => {
        console.log("[useCallback]");
        setCount((c) => c + 1);
    }, []);

    var value = useMemo(() => {
        console.log("[useMemo]");
        return { count, increment };
    }, [count, increment]);

    var increment2 = useCallback(() => setCount2((c) => c + 1), []);

    console.log("\n\n[parent]");

    return (
        <div>
            <CounterAppContext.Provider value={value}>
                <Header />
            </CounterAppContext.Provider>

            {/* <Increment2 increment2={increment2} count2={count2} /> */}
            <button onClick={increment2}>Increment 2: {count2}</button>
        </div>
    );
}

function Increment2({
    increment2,
    count2,
}: {
    increment2: () => void;
    count2: number;
}): JSX.Element {
    return <button onClick={increment2}>Increment 2: {count2}</button>;
}

function Header(): JSX.Element {
    console.log("[header]");
    return (
        <div>
            <DisplayCounter />
        </div>
    );
}

function DisplayCounter(): JSX.Element {
    var { count, increment } = useContext(CounterAppContext);
    console.log("[child]");
    return (
        <div>
            <div>The current count is {count}</div>
            <button onClick={increment}>Increment</button>
        </div>
    );
}

// You might be running into some build issue with your tooling that causes:
// SomeContext as seen from the providing component and SomeContext as seen by the
// reading component to be two different objects. This can happen if you use symlinks,
// for example. You can verify this by assigning them to globals like window.SomeContext1
// and window.SomeContext2 and then checking whether window.SomeContext1 === window.SomeContext2
// in the console. If they’re not the same, fix that issue on the build tool level.

// Note that the default value from your createContext(defaultValue) call is only used if there
// is no matching provider above at all. If there is a <SomeContext.Provider value={undefined}>
// component somewhere in the parent tree, the component calling useContext(SomeContext) will
// receive undefined as the context value.
