import { Data, IComment, IReply } from "@/utils/types";
import React, { FC } from "react";
import Button from "./Button";

interface Props {
  comment: IComment | null;
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
  isReply?: boolean;
  onSend: () => void;
  reply?: IReply;
  isEditing?: boolean;
}

const ReplyForm: FC<Props> = ({
  comment,
  setData,
  data,
  isReply,
  reply,
  onSend,
  isEditing,
}) => {
  const [replyText, setReplyText] = React.useState(reply?.content ?? "");

  const onReply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isReply || !comment) {
      return;
    }
    const dataClone = structuredClone(data);
    const otherComments = dataClone.comments.filter(
      (comm) => comment.id !== comm.id
    );
    const CReply: IReply = {
      id: Math.floor(Math.random() * 10000),
      content: replyText,
      createdAt: new Date().toISOString(),
      user: data.currentUser,
      score: 0,
      replyingTo: comment.user.username,
    };
    const newComment = { ...comment, replies: [...comment.replies, CReply] };
    const newComments = [...otherComments, newComment].sort(
      (a, b) => a.id - b.id
    );
    console.log("newComments", newComments);
    const newData = { ...data, comments: newComments };
    setData(newData);
    setReplyText("");
    onSend();
  };

  const onEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reply) return;
    const dataClone = structuredClone(data);
    const comment = dataClone.comments.find(
      (comm) => comm.user.username === reply.replyingTo
    );
    if (!comment) return;
    const otherComments = dataClone.comments.filter(
      (comm) => comment.id !== comm.id
    );
    const CReply: IReply = {
        ...reply,
        content: replyText,
    };
    const otherReplies = comment.replies.filter((rep) => rep.id !== reply.id);
    const newComment = { ...comment, replies: [...otherReplies, CReply] };
    const newComments = [...otherComments, newComment].sort(
      (a, b) => b.id - a.id
    );
    const newData = { ...data, comments: newComments };
    setData(newData);
    setReplyText("");
    onSend();
  };

  return (
    <form
      onSubmit={isEditing ? onEdit : onReply}
      className="flex  gap-x-3 text-sm w-full rounded-lg bg-white shadow p-2"
    >
      <img
        src={comment?.user.image.png}
        className="w-9 aspect-square h-9"
        alt=""
      />
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        name=""
        id=""
        cols={30}
        rows={5}
        className=" h-[10vh] duration-300 outline-none border-[1.4px] border-black focus:border-indigo-800 rounded-lg p-2 w-full"
      />
      <Button>
        {isEditing ? "Edit" : "Reply"}
      </Button>
    </form>
  );
};

export default ReplyForm;
