import React, { useEffect, useRef, useState } from "react";

import { PlusOutlined } from "@ant-design/icons";
import { Input, Tag } from "antd";
import PropTypes from "prop-types";
import { TweenOneGroup } from "rc-tween-one";

export const CustomTags = ({ incomeTags = [], updateTags }) => {
  const [tags, setTags] = useState(incomeTags);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, []);
  useEffect(() => {
    setTags(incomeTags);
  }, [incomeTags]);
  const handleClose = (removedTag) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
    updateTags((prev) => ({ ...prev, tags: newTags }));
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value.toUpperCase());
  };
  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue.toLowerCase()]);
      updateTags((prev) => ({
        ...prev,
        tags: [...tags, inputValue.toLowerCase()],
      }));
    }
    setInputVisible(false);
    setInputValue("");
  };
  const forMap = (tag) => {
    const tagElem = (
      <Tag
        closable
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span
        key={tag}
        style={{
          display: "inline-block",
        }}
      >
        {tagElem}
      </span>
    );
  };
  const tagChild = tags.map(forMap);
  return (
    <>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <TweenOneGroup
          enter={{
            scale: 0.8,
            opacity: 0,
            type: "from",
            duration: 100,
          }}
          onEnd={(e) => {
            if (e.type === "appear" || e.type === "enter") {
              e.target.style = "display: inline-block";
            }
          }}
          leave={{
            opacity: 0,
            width: 0,
            scale: 0,
            duration: 200,
          }}
          appear={false}
        >
          {tagChild}
        </TweenOneGroup>
      </div>
      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          style={{
            width: 78,
          }}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag onClick={showInput} className="site-tag-plus">
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </>
  );
};

CustomTags.propTypes = {
  updateTags: PropTypes.func.isRequired,
  incomeTags: PropTypes.array,
};
