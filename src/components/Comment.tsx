import { Data, IComment } from "@/utils/types";
import React, { FC, useEffect } from "react";
import { IconMinus, IconPlus, IconReply } from "./icons";
import ReplyForm from "./ReplyForm";

interface Props {
  comment: IComment;
  data: Data;
  setData: React.Dispatch<React.SetStateAction<Data>>;
}

const Comment: FC<Props> = ({ comment, data, setData }) => {
  const [score, setScore] = React.useState(comment.score);
  const [showReplyForm, setShowReplyForm] = React.useState({
    id: comment.id,
    show: false,
  });

  const handleShowReplyForm = (id: number) => {
    // if (showReplyForm.id !== id) {
    //   setShowReplyForm({ ...showReplyForm, show: false });
    // }
    setShowReplyForm({ id, show: !showReplyForm.show });
  };

  const handleScore = (type: "plus" | "minus") => {
    if (type === "plus") {
      setScore(score + 1);
    } else {
      if (score === 0) return;
      setScore(score - 1);
    }
  };

  useEffect(() => {
    const dataClone = structuredClone(data);
    // console.log('dataClone', dataClone);
    const otherComments = dataClone.comments.filter(
      (comm) => comment.id !== comm.id
    );
    const newComment = { ...comment, score };
    // console.log('newComment', newComment);
    const newComments = [...otherComments, newComment].sort(
      (a, b) => b.id - a.id
    );
    const newData = { ...data, comments: newComments };
    console.log("newComments", newData.comments);
    setData(newData);
  }, [score]);

  return (
    <>
      <div className="flex  gap-x-3 text-sm w-full rounded-lg bg-white shadow p-2">
        <div className="flex justify-between h-20 gap-y-1 flex-col bg-indigo-100 rounded-lg items-center text-indigo-700">
          <button
            onClick={() => handleScore("plus")}
            className="flex py-2 px-2 items-center justify-center text-center"
          >
            <IconPlus />
          </button>
          <span className="">{comment.score}</span>
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
              <img src={comment.user.image.png} className="w-7" alt="" />
              <span className="ml-2 font-bold">{comment.user.username}</span>
              <span className=" opacity-60 ml-2">{comment.createdAt}</span>
            </div>
            <button
              onClick={() => handleShowReplyForm(comment.id)}
              className="flex items-center gap-x-2 text-indigo-800 hover:text-indigo-400 "
            >
              <IconReply />
              <span className="font-semibold cursor-pointer">Reply</span>
            </button>
          </div>
          <span>{comment.content}</span>
        </div>
      </div>
      {showReplyForm.id === comment.id && showReplyForm.show && (
        <ReplyForm
          comment={comment}
          onSend={() =>
            setShowReplyForm({
              id: comment.id,
              show: false,
            })
          }
          data={data}
          setData={setData}
        />
      )}
    </>
  );
};

export default Comment;
