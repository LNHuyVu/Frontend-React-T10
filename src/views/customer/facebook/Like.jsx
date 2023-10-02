import { useEffect } from "react";
export default function Like(props) {
  let { link } = props;
  useEffect(()=>{
    initFacebookSDK()
  },[])
  const initFacebookSDK = () => {
    if (window.FB) {
      window.FB.XFBML.parse();
    }
    let locale = "vi_VN";
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.REACT_APP_APPID_FACEBOOK, // You App ID
        cookie: true, // enable cookies to allow the server to access
        // the session
        xfbml: true, // parse social plugins on this page
        version: "v2.5", // use version 2.1
      });
    };
    // Load the SDK asynchronously
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = `//connect.facebook.net/${locale}/sdk.js`;
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  };
  // Tạo AppID
  return (
    <>
      <div
        className="fb-like"
        data-href={"http://localhost:3000"}
        data-width=""
        data-layout="standard"
        data-action="like"
        data-size="small"
        data-share="true"
      ></div>
    </>
  );
}
