import { useEffect, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  listAll,
  getDownloadURL,
  getMetadata,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import s from "./Upload.module.scss";
import { Button } from "../Button/Button";
import { Preview } from "../Preview/Preview";
import { ProgressBar } from "../ProgressBar/ProgressBar";

//========================== FIREBASE ========
const firebaseConfig = {
  apiKey: "AIzaSyD2o6YXjSMZopUbNV4Lc-xkUJDxKpWqfic",
  authDomain: "upload-react-661ad.firebaseapp.com",
  projectId: "upload-react-661ad",
  storageBucket: "upload-react-661ad.appspot.com",
  messagingSenderId: "786708292141",
  appId: "1:786708292141:web:7638e4d73c432479ff8ea4",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

//==========================

export const Upload = () => {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);

  const getUploadedeImages = async () => {
    const listRef = ref(storage, "images/");

    const { items } = await listAll(listRef);

    const currentImage = [];

    for (let itemRef of items) {
      const url = await getDownloadURL(itemRef);
      const metadata = await getMetadata(itemRef);
      currentImage.push({
        name: metadata.name,
        size: metadata.size,
        url,
        ref: itemRef,
        id: metadata.customMetadata.id,
      });
    }

    setImages(currentImage);
  };

  useEffect(() => {
    getUploadedeImages();
  }, []);

  const handleSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (el) => {
        setImages((prev) => {
          return [
            ...prev,
            {
              name: file.name,
              size: file.size,
              url: reader.result,
              id: uuidv4(),
              file,
            },
          ];
        });
      };

      reader.readAsDataURL(file);
    });
  };

  const handleDelete = async (img) => {
    if (img.ref) {
      await deleteObject(img.ref);
    }
    setImages((prev) => {
      return prev.filter((_img) => _img.id !== img.id);
    });
  };

  const handleUpload = () => {
    images.forEach((image) => {
      if (!image.ref) {
        const storageRef = ref(storage, "images/" + image.name);
        const uploadTask = uploadBytesResumable(storageRef, image.file, {
          customMetadata: {
            id: image.id,
          },
        });

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            setImages((prev) => {
              return prev.map((_img) => {
                let temp;

                if (_img.id === image.id) {
                  temp = {
                    ..._img,
                    loaded: snapshot.bytesTransferred,
                  };
                }

                if (
                  _img.id === image.id &&
                  snapshot.bytesTransferred === snapshot.totalBytes
                ) {
                  temp = {
                    ...temp,
                    ref: storageRef,
                    done: true,
                  };
                }

                return temp || _img;
              });
            });
          },
          (error) => console.error(error)
        );
      }
    });
  };

  const getPercent = () => {
    const filtered = images.filter((image) => image.loaded);

    if (!filtered.length) {
      return 0;
    }

    const currentSize = filtered.reduce((acc, image) => {
      return acc + image.loaded;
    }, 0);

    if (!currentSize) {
      return 0;
    }

    const maxSize = filtered.reduce((acc, image) => {
      return acc + image.size;
    }, 0);

    if (currentSize === maxSize) {
      setImages((prev) => {
        return prev.map((image) => {
          return {
            ...image,
            done: undefined,
            loaded: undefined,
          };
        });
      });

      return 0;
    }

    return (currentSize * 100) / maxSize;
  };

  return (
    <div className={s.upload}>
      <div className={s.buttons}>
        <input
          multiple
          onChange={handleSelect}
          className={s.input}
          ref={inputRef}
          type="file"
        />
        <Button
          disabled={Boolean(getPercent())}
          onClick={() => inputRef.current.click()}
        >
          Выбрать
        </Button>
        <Button
          disabled={Boolean(getPercent())}
          onClick={handleUpload}
          themes="primary"
        >
          Загрузить
        </Button>
      </div>
      <ProgressBar percent={getPercent()} />

      {images.length > 0 ? (
        <div className={s.wrapperPreview}>
          {images.map((img) => {
            return <Preview onDelete={handleDelete} img={img} key={img.id} />;
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>Нет данных</div>
      )}
    </div>
  );
};
