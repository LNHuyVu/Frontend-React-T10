import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import topicService from "../../../services/topic.service";
import postService from "../../../services/post.service";
import ReactHtmlParser from "react-html-parser";
import "./post.scss";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Post = () => {
  const param = useParams();
  let slug = param.slug;
  let topId = "";
  const [post, setPost] = useState([]);
  const [title, setTitle] = useState("");
  useEffect(() => {
    init();
  }, [slug]);
  const init = () => {
    topicService
      .getAll(slug)
      .then((reponse) => {
        setTitle(reponse.data.topic.name);
        console.log(reponse.data);
        topId = reponse.data.topic.id == 1 ? "ALL" : reponse.data.topic.id;
        postService
          .getTopId(topId)
          .then((reponse) => {
            setPost(reponse.data.post);
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
    <div className="container-xl">
        <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <h3 className="text-center pt-3">{title}</h3>
      <div className="row">
        <div className="col-md-12 p-2">
          {post
            .filter((item) => {
              return item.topId != 2;
            })
            .map((item) => {
              return (
                <Link to={item.slug}>
                  <div class="w-100">
                    <div class="p-1">
                      <div class="card mb-3">
                        <div class="row g-0">
                          <div class="col-md-4">
                            <img
                              src={item.image}
                              class="img-fluid rounded-start"
                              alt="..."
                            />
                          </div>
                          <div class="col-md-8">
                            <div class="card-body">
                              <h5 class="card-title py-1">{item.title}</h5>
                              <p className="card-text my-0">
                                <span
                                  className="topic-detail"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      (item?.detail).slice(0, 170) + "...",
                                  }}
                                ></span>
                              </p>
                              <p class="card-text">
                                <small class="text-body-secondary">
                                  {item.createdAt}
                                </small>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Post;
