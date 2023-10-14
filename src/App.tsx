import { useEffect, useState } from "react";
import jsonData from "./assets/data.json";
import { Data } from "./utils/types";
import Comment from "./components/Comment";
import Reply from "./components/Reply";

function App() {
  // const [data, setData] = useState<Data>({ ...jsonData, comments: jsonData.comments.filter((comment) => comment.id === 2) } as Data);
  const [data, setData] = useState<Data>(jsonData);

  useEffect(() => {
    // get data from local storage
    const data = localStorage.getItem("data");
    // if data exists
    if (data) {
      // set data to state
      setData(JSON.parse(data));
    }
  }, []);

  // save data to local storage on every change
  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  return (
    <div className=" w-full flex flex-col items-center bg-blue-600/10 min-h-screen">
      <div className=" max-w-[700px] py-11 flex-col flex w-full gap-y-4">
        {data.comments.map((comment) => {
          return (
            <div key={comment.id} className="flex flex-col w-full gap-y-3">
              <Comment
                data={data}
                setData={setData}
                key={String(comment.id)+String(comment.user.username)}
                comment={comment}
              />
              <div className="flex ml-11 flex-col gap-y-2">
                {comment.replies.map((reply) => (
                  <Reply
                    setData={setData}
                    data={data}
                    key={reply.id+reply.user.username+comment.id}
                    reply={reply}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
