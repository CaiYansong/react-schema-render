import { Link } from "umi";

import styles from "./index.less";

import routes from "../router/routes";

export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <ul>
        {routes.map((it) => {
          return (
            <li key={it.path}>
              <Link to={it.path}>{it.path}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
