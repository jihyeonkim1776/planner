import React from "react";
import { IoIosNotifications } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci";
const Task = () => {
  return (
    <div>
      <div className="todo">
        <div className="title">Task</div>
        <div className="todo-list">
          <div className="item">
            <input type="checkbox" name="" id="" />
            <div className="item__content">빨래하기</div>
            <div className="item__detail">
              <IoIosNotifications />
            </div>
          </div>
          <div className="item">
            <input type="checkbox" name="" id="" />
            <div className="item__content">빨래하기</div>
            <div className="item__detail">
              <IoIosNotifications />
            </div>
          </div>
          <div className="item">
            <input type="checkbox" name="" id="" />
            <div className="item__content">빨래하기</div>
            <div className="item__detail">
              <IoIosNotifications />
            </div>
          </div>
          <div className="item">
            <input type="checkbox" name="" id="" />
            <div className="item__content">빨래하기</div>
            <div className="item__detail">
              <IoIosNotifications />
            </div>
          </div>
        </div>
        <div className="plus">
          <CiCirclePlus />
        </div>
      </div>
    </div>
  );
};

export default Task;
