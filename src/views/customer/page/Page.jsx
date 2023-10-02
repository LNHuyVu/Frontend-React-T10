import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import postService from "../../../services/post.service";
import { Helmet } from "react-helmet";

const Page = () => {
  const param = useParams();
  let slug = param.slug;
  const [post, setPost] = useState("");
  useEffect(() => {
    init();
  }, [slug]);
  const init = () => {
    postService
      .getAll(slug)
      .then((res) => {
        console.log(res.data);
        setPost(res.data.post);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="page-info">
      <div>
        <Helmet>
          <title>{post?.title}</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="container bg-light">
        <h3 className="text-center">{post?.title}</h3>
        <div className="text-center py-3">
          <img src={post?.image} alt="" />
        </div>
        <div>
          <span dangerouslySetInnerHTML={{ __html: post?.detail }}></span>
        </div>
      </div>
    </div>
  );
};

export default Page;
