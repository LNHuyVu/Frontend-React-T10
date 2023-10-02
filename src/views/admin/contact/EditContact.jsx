import React from "react";
import { FcPlus } from "react-icons/fc";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import contactService from "../../../services/contact.service";
import Form from "react-bootstrap/Form";
import { useQuill } from "react-quilljs";
import { TiArrowBackOutline } from "react-icons/ti";
import emailService from "../../../services/email.service";
import { Helmet } from "react-helmet";

const EditContact = () => {
  //Quilljs
  const { quill, quillRef } = useQuill();
  const navigate = useNavigate();
  const param = useParams();
  let id = param.id;
  const [status, setStatus] = useState("1");
  const [replyDetail, setReplyDetail] = useState("");
  const [contact, setContact] = useState("");
  const userRD = useSelector((state) => state.auth.login?.currentUser);

  const init = () => {
    contactService
      .getAll(id)
      .then((response) => {
        quillRef.current.firstChild.innerHTML =
          response.data.contact.replyDetail;
        setContact(response.data.contact);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    init();
  }, [id]);
  const handleSubmit = () => {
    const contact_reply = {
      id: id,
      replyDetail: quillRef.current.firstChild.innerHTML,
      replyBy: userRD?.user?.id,
      status,
    };
    contactService
      .update(contact_reply)
      .then((response) => {
        console.log("OK");
        navigate("/dashboard/contact");
      })
      .catch((error) => {
        console.log(error);
      });
    emailService
      .sendEmailContact({ contact, contact_reply })
      .then((response) => {
        console.log("OK");
      })
      .catch((error) => {
        console.log(error);
      });
    // console.log({ contact, contact_reply });
  };
  return (
    <div className="edit-contact">
      <div>
        <Helmet>
          <title>Phản hồi liên hệ</title>
          <meta name="description" content="Helmet application" />
        </Helmet>
      </div>
      <div className="text-center d-flex justify-content-between align-items-center mb-3">
        <div>
          <Link to="/dashboard/contact">
            <button className="btn border border-3 border-primary d-flex ">
              <TiArrowBackOutline className="fs-4 text-primary" />
              Quay lại
            </button>
          </Link>
        </div>

        <div>
          <h2>Phản hồi</h2>
        </div>
        <div></div>
      </div>
      <div className="row">
        <div className="col-md-12 bg-info rounded-1">
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Tên người liên hệ</Form.Label>
              <Form.Control
                type="text"
                readOnly
                value={contact.name}
                className="bg-white"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                readOnly
                value={contact.email}
                className="bg-white"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Nội dung liên hệ</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                readOnly
                value={contact.content}
                className="bg-white"
              />
            </Form.Group>
          </Form>
        </div>
        <div className="col-md-12 my-3">
          <div className="mb-3" controlId="exampleForm.ControlTextarea1">
            <h3 className="text-center">Nội dung phản hồi</h3>
            <div
              className="mb-5"
              style={{ width: "100%", height: 500, background: "#fff" }}
            >
              <div ref={quillRef} />
            </div>
          </div>
          <button className="btn btn-info w-100" onClick={() => handleSubmit()}>
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditContact;
