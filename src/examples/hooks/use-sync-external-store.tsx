// useSyncExternalStore is a React Hook that lets you subscribe to an external store.

import { useState, useSyncExternalStore } from "react";

// ======================================
// STORE
// ======================================

var nextId = 0;
var todos = [
    { id: nextId++, text: "Learn React" },
    { id: nextId++, text: "Learn TypeScript" },
];
var listeners: CallableFunction[] = [];

var todoStore = {
    addTodo: function (text: string) {
        // todos.push({ id: nextId++, text }); // This is wrong and won't work
        todos = [...todos, { id: nextId++, text }];
        console.log("[addTodo] todos", todos);
        listeners.forEach((listener) => listener());
    },
    getSnapshot: function () {
        console.log("[getSnapshot] todos", todos);
        return todos;
    },
    subscribe: function (listener: CallableFunction) {
        listeners.push(listener);
        console.log("[subscribe] listeners", listeners);

        return function unsubscribe() {
            console.log("[unsubscribe] listeners", listeners);
            listeners = listeners.filter((l) => l !== listener);
        };
    },
};

// ======================================
// COMPONENT
// ======================================

export default function App(): JSX.Element {
    var [show, setShow] = useState(false);

    return (
        <div>
            <OnlineStatus />
            <button onClick={() => setShow(!show)}>Toggle</button>
            {show && <Todos />}
        </div>
    );
}

function Todos(): JSX.Element {
    var todos = useSyncExternalStore(
        todoStore.subscribe,
        todoStore.getSnapshot
    );

    return (
        <div>
            <h2>Good morning</h2>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id.toString()}>{todo.text}</li>
                ))}

                <li>
                    <button onClick={() => todoStore.addTodo("Learn Hooks")}>
                        Add Todo
                    </button>

                    <button onClick={() => todoStore.addTodo("Learn Redux")}>
                        Add Todo
                    </button>

                    <button onClick={() => todoStore.addTodo("Learn MobX")}>
                        Add Todo
                    </button>
                </li>
            </ul>
        </div>
    );
}

function OnlineStatus(): JSX.Element {
    var isOnline = useOnlineStatus();

    return (
        <div>
            <h2>Good morning</h2>

            <p>Are you online? {isOnline ? "Yes" : "No"}</p>
        </div>
    );
}

function useOnlineStatus() {
    const isOnline = useSyncExternalStore(subscribe, getSnapshot);
    return isOnline;
}

function getSnapshot() {
    return navigator.onLine;
}

function subscribe(callback: () => void) {
    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);
    return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
    };
}
