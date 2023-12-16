import "./style.css";
import "../../index.css";
import { useEffect } from "react";
const _404 = () => {
  useEffect(() => {
    document.title = "404";
  }, []);
  return (
    <div id="_404">
      <img src="./assets/404.svg" alt="" />
      <h1>Page Not Found</h1>
    </div>
  );
};
export default _404;
