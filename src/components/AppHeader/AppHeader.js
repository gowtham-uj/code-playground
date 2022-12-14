import "./AppHeader.css";
import { motion } from "framer-motion";
import shortUid from "short-uuid";

export default function AppHeader(props) {
  return (
    <nav className="navMenu">
      <div className="nav-left">
        {props.leftLinks.map((el) => {
          return el;
        })}
      </div>
      <div className="nav-right">
        {props.rightLinks.map((el) => {
          return (
            <motion.a
              href={el.href}
              whileHover={{ borderBottom: "4px solid #ffc600" }}
              key={shortUid.generate()}
            >
              {el.name}
            </motion.a>
          );
        })}
      </div>
    </nav>
  );
}
