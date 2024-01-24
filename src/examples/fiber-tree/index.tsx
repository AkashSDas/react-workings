import { useState } from "react";

export default function FiberTree(): JSX.Element {
    var [nums, setNums] = useState<number[]>([1, 2, 3]);

    return (
        <List>
            <button onClick={() => raisedToPowerOf2()}>Click</button>
            <Item text={nums[0]} />
            <Item text={nums[1]} />
            <Item text={nums[2]} />
        </List>
    );

    function raisedToPowerOf2() {
        setNums(nums.map((n) => n * n));
    }
}

function List({ children }: { children: JSX.Element[] }) {
    return <div>{children}</div>;
}

function Item({ text }: { text: number }) {
    return <div>{text}</div>;
}
