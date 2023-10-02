import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import postService from "../../../services/post.service";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import "./postdetail.scss";
const PostDetail = () => {
  const param = useParams();
  let id = param.id;
  let slug = param.slug;
  const [post, setPost] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  useEffect(() => {
    init();
  }, [id]);
  const init = () => {
    postService
      .getAll(id)
      .then((reponse) => {
        setPost(reponse.data.post);
        console.log("POST", reponse.data);
        postService
          .getTopId(reponse.data.post.topId)
          .then((reponse) => {
            setRelatedPosts(reponse.data.post);
            console.log("TopID", reponse.data.post);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="container postdetail my-2">
      <div>
        <Helmet>
          <title>{post.title}</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="row">
        <div className="col-md-8">
          <h2 className="post-title">{post.title}</h2>
          <div className="text-center">
            <img src={post.image} alt="" />
          </div>
          <div className="detail">
            <span
              style={{ background: "#fff" }}
              dangerouslySetInnerHTML={{
                __html: post.detail,
              }}
            ></span>
          </div>
        </div>
        <div className="col-md-4 px-2 related-posts">
          <h2 className="text-center">Liên quan</h2>
          <div>
            {relatedPosts
              .filter((item) => {
                return item.id != post.id;
              })
              .map((item) => {
                return (
                  <Link to={"/post/" + slug + "/" + item.slug}>
                    <div class="card">
                      <img src={item.image} class="card-img-top" alt="..." />
                      <div class="card-body">
                        <h5 class="card-title">{item.title}</h5>
                        <p class="card-text">
                          <span
                            className="topic-detail"
                            dangerouslySetInnerHTML={{
                              __html: item.detail.slice(0, 170) + "...",
                            }}
                          ></span>
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
