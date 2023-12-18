import s from "./App.module.scss";
import { Upload } from "./components/Upload/Upload";

function App() {
  return (
    <div className={s.App}>
      <div className={s.container}>
        <Upload />
      </div>
    </div>
  );
}

export default App;
