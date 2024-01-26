// useId is a React Hook for generating unique IDs that can be passed to
// accessibility attributes.

// With server rendering, useId requires an identical component tree on the server and
// the client. If the trees you render on the server and the client don’t match
// exactly, the generated IDs won’t match.

// You might be wondering why useId is better than incrementing a global variable like nextId++.
//
// The primary benefit of useId is that React ensures that it works with server rendering.
// During server rendering, your components generate HTML output. Later, on the client,
// hydration attaches your event handlers to the generated HTML. For hydration to work,
// the client output must match the server HTML.
//
// The primary benefit of useId is that React ensures that it works with server rendering.
// This is very difficult to guarantee with an incrementing counter because the order
// in which the Client Components are hydrated may not match the order in which the server HTML
// was emitted. By calling useId, you ensure that hydration will work, and the output will
// match between the server and the client.
//
// Inside React, useId is generated from the “parent path” of the calling component. This
// is why, if the client and the server tree are the same, the “parent path” will match up
// regardless of rendering order.

import { useId } from "react";

export default function App(): JSX.Element {
    var usernameHintId = useId();

    return (
        <div>
            <input type="text" aria-describedby={usernameHintId} />
            <p id={usernameHintId}>Enter your username</p>

            {/* Old way */}
            <label>
                Password:
                <input type="password" aria-describedby="password-hint" />
            </label>
            <p id="password-hint">
                The password should contain at least 18 characters
            </p>
        </div>
    );
}
