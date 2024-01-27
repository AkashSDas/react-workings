// The dispatch function only updates the state variable for the next render. If you
// read the state variable after calling the dispatch function, you will still get the
// old value that was on the screen before your call.

// If the new value you provide is identical to the current state, as determined by
// an Object.is comparison, React will skip re-rendering the component and its children.
// This is an optimization. React may still need to call your component before ignoring
// the result, but it shouldn’t affect your code.

// React batches state updates. It updates the screen after all the event handlers have
// run and have called their set functions. This prevents multiple re-renders during a
// single event. In the rare case that you need to force React to update the screen
// earlier, for example to access the DOM, you can use flushSync.

import { Reducer, useReducer } from "react";
import { useImmerReducer } from "use-immer";

type State = {
    count: number;
};

type Action = {
    type: "increment" | "decrement";
    payload: number;
};

const reducer: Reducer<State, Action> = (state, action) => {
    switch (action.type) {
        case "increment":
            return { count: state.count + action.payload };
        case "decrement":
            return { count: state.count - action.payload };
        default:
            throw new Error("Invalid action type");
    }
};

var initialCount = 9;

export default function App(): JSX.Element {
    var [state, dispatch] = useReducer(
        reducer,
        initialCount,
        (initialState) => {
            // In Strict Mode, React will call your reducer and initializer twice
            console.log("[initialState] ", initialState);
            return { count: initialState };
        }
    );

    return (
        <div>
            <h3>Count: {state.count}</h3>
            <button onClick={increment}>Increment</button>
            <hr />
            <TodoApp />
        </div>
    );

    function increment(): void {
        dispatch({ type: "increment", payload: 1 });
    }
}

function TodoApp(): JSX.Element {
    type State = {
        tasks: { title: string; done: boolean }[];
    };

    type Action =
        | {
              type: "add";
              payload: string;
          }
        | {
              type: "toggle";
              payload: number;
          };

    var [state, dispatch] = useImmerReducer<State, Action>(
        (draft, action) => {
            switch (action.type) {
                case "add":
                    draft.tasks.push({ title: action.payload, done: false });
                    break;
                case "toggle":
                    var task = draft.tasks[action.payload];
                    task.done = !task.done;
                    break;
                default:
                    throw new Error("Invalid action type");
            }
        },
        { tasks: [] }
    );

    return (
        <div>
            <h3>Tasks</h3>
            <ul>
                {state.tasks.map((task, index) => (
                    <li key={index}>
                        <label>
                            <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() =>
                                    dispatch({ type: "toggle", payload: index })
                                }
                            />
                            {task.title}
                        </label>
                    </li>
                ))}
            </ul>
            <button onClick={addTask}>Add Task</button>
        </div>
    );

    function addTask(): void {
        var title = prompt("Task title");
        if (title) {
            dispatch({ type: "add", payload: title });
        }
    }
}
