import { useState } from "react";
import { Mask } from "antd-mobile";
import { PlayOutline } from "antd-mobile-icons";

import "./index.less";

function Video({ src, href }) {
  const [maskVisible, setMaskVisible] = useState(false);

  function onPreview() {
    setMaskVisible(true);
  }

  return (
    <div className="video-wrap">
      <PlayOutline fontSize={30} onClick={onPreview} />
      <Mask
        className="video-mask"
        visible={maskVisible}
        destroyOnClose
        onMaskClick={() => setMaskVisible(false)}
      >
        <video className="file-item-view" src={src} controls>
          抱歉，您的浏览器不支持内嵌视频，不过不用担心，你可以
          <a href={href || src}>下载</a>
          并用你喜欢的播放器观看！
        </video>
      </Mask>
    </div>
  );
}

export default Video;
