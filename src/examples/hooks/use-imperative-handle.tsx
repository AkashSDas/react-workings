// Do not overuse refs. You should only use refs for imperative behaviors that you can’t express as props: for example, scrolling to a node, focusing a node, triggering an animation, selecting text, and so on.
// If you can express something as a prop, you should not use a ref. For example, instead of exposing an imperative handle like { open, close } from a Modal component, it is better to take isOpen as a prop like <Modal isOpen={isOpen} />. Effects can help you expose imperative behaviors via props.

import { useRef, useImperativeHandle, forwardRef } from "react";

type CommentListRef = {
    scrollToBottom: () => void;
};

type PostRef = {
    scrollAndFocusAddComment: () => void;
};

export default function App(): JSX.Element {
    var postRef = useRef<PostRef>(null);

    function handleClick() {
        postRef.current?.scrollAndFocusAddComment();
    }

    return (
        <div>
            <button onClick={handleClick}>Write a comment</button>

            <Post ref={postRef} />
        </div>
    );
}

var Post = forwardRef<PostRef>(function Post(props, ref) {
    var commentsRef = useRef<CommentListRef>(null);
    var addCommentRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(
        ref,
        function () {
            return {
                scrollAndFocusAddComment() {
                    commentsRef.current?.scrollToBottom();
                    addCommentRef.current?.focus();
                },
            };
        },
        []
    );

    return (
        <>
            <CommentList ref={commentsRef} />
            <AddCommentInput ref={addCommentRef} />
        </>
    );
});

var CommentList = forwardRef<CommentListRef>(function CommentList(props, ref) {
    var divRef = useRef<HTMLDivElement>(null);

    var comments: JSX.Element[] = [];
    for (let i = 0; i < 100; i++) {
        comments.push(<p key={i}>#{i + 1} Comment</p>);
    }

    useImperativeHandle(ref, function () {
        return {
            scrollToBottom: () => {
                divRef.current?.scrollIntoView({ behavior: "smooth" });
            },
        };
    });

    return <div ref={divRef}>{comments}</div>;
});

var AddCommentInput = forwardRef<HTMLInputElement>(function AddCommentInput(
    props,
    ref
) {
    return <input {...props} ref={ref} />;
});
