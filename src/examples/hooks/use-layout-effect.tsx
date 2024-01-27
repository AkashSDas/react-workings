import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function App(): JSX.Element {
    var [show, setShow] = useState<boolean>(false);

    return (
        <div>
            <button onClick={toggle}>Toggle</button>
            <hr />
            {show && <UseLayoutEffect />}

            {/* <hr />
            <TooltipExample /> */}
        </div>
    );

    function toggle() {
        setShow((p) => !p);
    }
}

// - Tooltip renders with the initial tooltipHeight = 0 (so the tooltip may be wrongly positioned).
// - React places it in the DOM and runs the code in useLayoutEffect.
//
// - Your useLayoutEffect measures the height of the tooltip content and triggers an immediate re-render.
//
// - Tooltip renders again with the real tooltipHeight (so the tooltip is correctly positioned).
// - React updates it in the DOM, and the browser finally displays the tooltip.
//
// To do this, you need to render in two passes:
// - Render the tooltip anywhere (even with a wrong position).
// - Measure its height and decide where to place the tooltip.
// - Render the tooltip again in the correct place.
//
// Rendering in two passes and blocking the browser hurts performance. Try to avoid this when you can.
function TooltipExample(): JSX.Element {
    type BtnDOMRect = Pick<DOMRect, "left" | "top" | "bottom" | "right">;

    var btnRef = useRef<HTMLButtonElement>(null);
    var [btnRect, setBtnRect] = useState<BtnDOMRect>({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });

    return (
        <div>
            <button ref={btnRef} onMouseEnter={handleBtnMouseEnter}>
                Hover me
            </button>

            {createPortal(<Tooltip btnRect={btnRect} />, document.body)}
        </div>
    );

    function Tooltip({ btnRect }: { btnRect: BtnDOMRect }): JSX.Element {
        var ref = useRef<HTMLDivElement>(null);
        var [tooltipHeight, setTooltipHeight] = useState(0);

        useLayoutEffect(() => {
            const { height } = ref.current?.getBoundingClientRect() ?? {
                height: 0,
            };
            setTooltipHeight(height);
            console.log("Measured tooltip height: " + height);
        }, []);

        var tooltipX = 0;
        var tooltipY = 0;
        if (btnRect !== null) {
            tooltipX = btnRect.left;
            tooltipY = btnRect.top - tooltipHeight;

            // It doesn't fit above, so place below.
            if (tooltipY < 0) {
                tooltipY = btnRect.bottom;
            }
        }

        return (
            <div
                style={{
                    position: "absolute",
                    pointerEvents: "none",
                    left: 0,
                    top: 0,
                    transform: `translate3d(${tooltipX}px, ${tooltipX}px, 0)`,
                }}
            >
                <div ref={ref} className="tooltip">
                    Content of the tooltip
                </div>
            </div>
        );
    }

    function handleBtnMouseEnter() {
        var rect = btnRef.current?.getBoundingClientRect();

        if (rect) {
            setBtnRect(rect);
        }
    }
}

// Call useLayoutEffect to perform the layout measurements before the browser repaints the screen
// useEffect vs useLayoutEffect - https://kentcdodds.com/blog/useeffect-vs-uselayouteffect

// useLayoutEffect:
// setup: The function with your Effect’s logic. Your setup function may also optionally return
// a cleanup function. Before your component is added to the DOM, React will run your setup function.
// After every re-render with changed dependencies, React will first run the cleanup function (if
// you provided it) with the old values, and then run your setup function with the new values.
// Before your component is removed from the DOM, React will run your cleanup function.
//
// useEffect:
// setup: The function with your Effect’s logic. Your setup function may also optionally return
// a cleanup function. When your component is added to the DOM, React will run your setup function.
// After every re-render with changed dependencies, React will first run the cleanup function (if
// you provided it) with the old values, and then run your setup function with the new values.
// After your component is removed from the DOM, React will run your cleanup function.

function UseLayoutEffect(): JSX.Element {
    var [count, setCount] = useState<number>(0);
    var [layoutDep, setLayoutDep] = useState<number>(0);
    var [effectDep, setEffectDep] = useState<number>(0);

    useLayoutEffect(
        function effect() {
            console.log("[useLayoutEffect] INIT 1");

            return () => {
                console.log("[useLayoutEffect] END 1");
            };
        },
        [layoutDep]
    );

    useLayoutEffect(function effect() {
        console.log("[useLayoutEffect] INIT 2");

        return () => {
            console.log("[useLayoutEffect] END 2");
        };
    }, []);

    useEffect(
        function effect() {
            console.log("[useEffect] INIT 1");

            return () => {
                console.log("[useEffect] END 1");
            };
        },
        [effectDep]
    );

    useEffect(function effect() {
        console.log("[useEffect] INIT 2");

        return () => {
            console.log("[useEffect] END 2");
        };
    }, []);

    console.log("[component] RENDER");

    var performance = window.performance.now();
    while (window.performance.now() - performance < 1000) {
        // Artificial delay
    }

    return (
        <div>
            <h1>useEffect</h1>
            <button onClick={set(setCount)}>Increment {count}</button>
            <button onClick={set(setLayoutDep)}>
                Trigger layout {layoutDep}
            </button>
            <button onClick={set(setEffectDep)}>
                Trigger effect {effectDep}
            </button>
        </div>
    );

    function set(stateSetter: CallableFunction) {
        return function () {
            stateSetter((p: number) => {
                console.log("[stateSetter] STATE");
                return p + 1;
            });
        };
    }
}
