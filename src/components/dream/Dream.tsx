import React, { useState } from "react";

export default function Dream() {
  const [postContent, setPostContent] = useState("");

  const completeWriting = () => {
    console.log("Posted content:", postContent);
    setPostContent("");
  };

  return (
    <div>
      <div className="goal-content">
        <div className="text-group__title">1. The Dream Life</div>
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          className="textarea-focused"
          placeholder="Write your post here... example “day in the life”:

          The perfect day in the perfect life for an average person in the world would start with waking up in a comfortable bed in a peaceful and safe environment. I would live in a well-designed and well-maintained home, surrounded by nature and greenery. After waking up, I would have a healthy and nutritious breakfast, followed by a workout or yoga session to start their day off on the right foot."
        />
      </div>
    </div>
  );
}
