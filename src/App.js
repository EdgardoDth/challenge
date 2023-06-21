import React, { useRef, useState, useEffect } from "react";
import Component from "./components/Component/Component";
import "./styles.css";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [allPhotosUrl, setAllPhotosUrl] = useState([]);

  useEffect(() => {
    getPhotosFromExternalApi();
  }, []);

  const getPhotosFromExternalApi = async () => {
    //getting a list of photos from a public API
    try {
      const response = await fetch(
       "https://jsonplaceholder.typicode.com/photos"
     ).then((response) => response.json());

    const urls = response.map((item) => {
      return item.url;
    });

    setAllPhotosUrl(urls);
   } catch (error) {
     console.error(error);
   }
  };

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    const COLORS = ["red", "blue", "yellow", "green", "purple"];
    const FITS = ["fill", "contain", "cover", "none", "scale-down"];

    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        updateEnd: true,
        imagen: allPhotosUrl[getRandomInt(allPhotosUrl.length)],
        fit: FITS[getRandomInt(FITS.length)]
      },
    ]);
  };

  const removeMoveable = () => {
    const newElements = moveableComponents.filter((item) => item.id !== selected);
    setMoveableComponents(newElements);
    setSelected(null);
  };

  const checkValidBounds = (component) => {
    let parent = document.getElementById("parent");
    let parentBounds = parent?.getBoundingClientRect();

    const rightBorder = component.left + component.width;
    const buttonBorder = component.top + component.height;

    if(component.top <0 || component.left < 0
      || rightBorder > parentBounds.width || buttonBorder > parentBounds.height) {
      return false;
    }

    return true;
  };


  const updateMoveable = (id, newComponent, updateEnd = false) => {
    //move only inside the parent div
    if(checkValidBounds(newComponent)) {
      const updatedMoveables = moveableComponents.map((moveable, i) => {
        if (moveable.id === id) {
          return { id, ...newComponent, updateEnd };
        }
        return moveable;
      });
      setMoveableComponents(updatedMoveables);
    }
  };

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  return (
    <main className="main">
      <div className="buttons-container">
        <button
          className="button add-button"
          onClick={addMoveable}
        >
          Add Moveable
        </button>
        {
          selected &&
            <button
              className="button remove-button"
              onClick={removeMoveable}
            >
              Remove Moveable
            </button>
        }
      </div>
      <div
        id="parent"
        className="parent-div"
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
          />
        ))}
      </div>
    </main>
  );
};

export default App;
