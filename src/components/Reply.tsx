import { Data, IComment, IReply } from "@/utils/types";
import React, { FC, useEffect } from "react";
import { IconDelete, IconEdit, IconMinus, IconPlus, IconReply } from "./icons";
import ReplyForm from "./ReplyForm";

interface Props {
  reply: IReply;
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
}

const Reply: FC<Props> = ({ reply, setData, data }) => {
  const [score, setScore] = React.useState(reply.score);
  const [showReplyForm, setShowReplyForm] = React.useState({
    id: reply.id,
    show: false,
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const [comment, setComment] = React.useState<IComment | null>(null);

  const handleOnEdit = () => {
    setIsEditing(true);
    setShowReplyForm({ id: reply.id, show: true });
  };

  const handleShowReplyForm = (id: number) => {
    // if (showReplyForm.id !== id) {
    //   setShowReplyForm({ ...showReplyForm, show: false });
    // }
    setShowReplyForm({ id, show: !showReplyForm.show });
  };

  const onDelete = () => {
    const dataClone = structuredClone(data);
    const comment = dataClone.comments.find(
      (comm) => comm.user.username === reply.replyingTo
    );
    console.log('reply', reply.replyingTo)
    console.log("comment", comment);
    if (!comment) return;
    const otherComments = dataClone.comments.filter(
      (comm) => comment.id !== comm.id
    );
    const otherReplies = comment.replies.filter((rep) => rep.id !== reply.id);
    const newComment = { ...comment, replies: otherReplies };
    const newComments = [...otherComments, newComment].sort(
      (a, b) => a.id - b.id
    );
    const newData = { ...data, comments: newComments };
    console.log("newComments", newData.comments);
    setData(newData);
  };

  const handleScore = (type: "plus" | "minus") => {
    const isUser = data.currentUser.username === reply.user.username;
    if (isUser) return;
    if (type === "plus") {
      setScore(score + 1);
    } else {
      if (score === 0) return;
      setScore(score - 1);
    }
  };

  useEffect(() => {
    const dataClone = structuredClone(data);
    const comment = dataClone.comments.find(
      (comm) => comm.user.username === reply.replyingTo
    );
    if (!comment) return;
    const otherComments = dataClone.comments.filter(
      (comm) => comment.id !== comm.id
    );
    const otherReplies = comment.replies.filter((rep) => rep.id !== reply.id);
    const newReply = { ...reply, score };
    const newComment = { ...comment, replies: [...otherReplies, newReply] };
    const newComments = [...otherComments, newComment].sort(
      (a, b) => b.id - a.id
    );
    const newData = { ...data, comments: newComments };
    setData(newData);
  }, [score]);

  // set comment
  useEffect(() => {
    const dataClone = structuredClone(data);
    const comment = dataClone.comments.find(
      (comm) => comm.user.username === reply.replyingTo
    );
    if (!comment) return;
    setComment(comment);
  }, []);

  return (
    <>
      <div className="flex gap-x-3 text-sm w-full rounded-lg bg-white shadow p-2">
        <div className="flex justify-between h-20 gap-y-1 flex-col bg-indigo-100 rounded-lg items-center text-indigo-700">
          <button
            onClick={() => handleScore("plus")}
            className="flex py-2 px-2 items-center justify-center text-center"
          >
            <IconPlus />
          </button>
          <span className="">{reply.score}</span>
          <button
            onClick={() => handleScore("minus")}
            className="flex py-2 px-2 items-center justify-center text-center"
          >
            <IconMinus />
          </button>
        </div>
        <div className="flex flex-col w-full gap-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={reply.user.image.png} className="w-7" alt="" />
              <span className="ml-2 font-bold">{reply.user.username}</span>
              <span className=" opacity-60 ml-2">{reply.createdAt}</span>
            </div>
            {reply.user.username === data.currentUser.username ? (
              <div className="flex  items-center gap-x-2">
                <button
                  onClick={onDelete}
                  className="flex items-center gap-x-2 text-red-800 hover:text-red-400 "
                >
                  <IconDelete />
                  <span className="font-semibold cursor-pointer">Delete</span>
                </button>
                <button
                  onClick={handleOnEdit}
                  className="flex items-center gap-x-2 text-indigo-800 hover:text-indigo-400 "
                >
                  <IconEdit />
                  <span className="font-semibold cursor-pointer">Edit</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {}}
                className="flex items-center gap-x-2 text-indigo-800 hover:text-indigo-400 "
              >
                <IconReply />
                <span className="font-semibold cursor-pointer">Reply</span>
              </button>
            )}
          </div>
          <span>{reply.content}</span>
        </div>
      </div>
      {showReplyForm.id === reply.id && showReplyForm.show && (
        <ReplyForm
          comment={comment}
          reply={reply}
          isEditing={isEditing}
          onSend={() => {
            setShowReplyForm({
              id: reply.id,
              show: false,
            });
            setIsEditing(false);
          }}
          setData={setData}
          data={data}
        />
      )}
    </>
  );
};

export default Reply;
