import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "react-js-pagination";
import "../App.css";

// get data from localStorage

const getLocalItems = () => {
  let list = localStorage.getItem("lists");
  console.log(list);

  if (list) {
    return JSON.parse(localStorage.getItem("lists"));
  } else {
    return [];
  }
};
const Todo = () => {
  const [inputData, setInputData] = useState("");
  const [items, setItems] = useState(getLocalItems());
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [isEditItem, setIsEditItem] = useState(null);
  const [page, setpage] = useState(1);
  const [perPage, setPerPage] = useState(1);
  const [total, setTotal] = useState(1);

  const changeHandler = (event) => {
    setInputData(event.target.value);
  };

  const addItemsHandler = () => {
    if (!inputData) {
      alert("Plzz fill data");
    } else if (inputData && !toggleSubmit) {
      setItems(
        items.map((elem) => {
          if (elem.id === isEditItem) {
            return { ...elem, name: inputData };
          }
          return elem;
        })
      );
      setToggleSubmit(true);
      setInputData("");
      setIsEditItem(null);
    } else {
      const allInputData = {
        id: new Date().getTime().toString(),
        name: inputData,
      };
      setItems([...items, allInputData]);
      setInputData("");
    }
  };

  const deleteItemsHandler = (index) => {
    const updateditems = items.filter((elem) => {
      return index !== elem.id;
    });
    setItems(updateditems);
  };

  const handlePress = (event) => {
    if (event.key === "Enter") {
      addItemsHandler();
    }
  };

  const editItemsHandler = (id) => {
    let newEditItem = items.find((elem) => {
      return elem.id === id;
    });
    console.log(newEditItem);
    setToggleSubmit(false);
    setInputData(newEditItem.name);
    setIsEditItem(id);
  };

  // add data to localStorage

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(items));
  }, [items]);

  // fatch API
  useEffect(() => {
    async function getData() {
      const res = await axios.get(`https://reqres.in/api/users?page=${page}`);
      const result = res.data.data.map((v) => ({
        id: v.id,
        name: v.first_name,
      }));
      setItems(result);
      setPerPage(res.data.per_page);
      setTotal(res.data.total);
      console.log(res.data);
    }
    getData();
  }, [page]);

  return (
    <>
      <div className="main-div">
        <div className="child-div">
          <h1>todo app</h1>

          <div className="addItems">
            <input
              type="text"
              placeholder="Add  Items..."
              value={inputData}
              onChange={changeHandler}
              onKeyPress={handlePress}
            />

            {toggleSubmit ? (
              <i
                className="fa fa-plus add-btn"
                title="Add Item"
                onClick={addItemsHandler}
              ></i>
            ) : (
              <i
                className="fa fa-edit add-btn"
                title="Update Item"
                onClick={addItemsHandler}
              ></i>
            )}
          </div>
          {items.map((elem) => {
            return (
              <div className="eachItem" key={elem.id}>
                <h3>{elem.name}</h3>
                <div className="todo-btn">
                  <i
                    className="fa fa-edit add-btn"
                    title="Edit Item"
                    onClick={() => editItemsHandler(elem.id)}
                  ></i>
                  <i
                    className="fa fa-trash-alt add-btn"
                    title="Delete Item"
                    onClick={() => deleteItemsHandler(elem.id)}
                  ></i>
                </div>
              </div>
            );
          })}
          <Pagination
            activePage={page}
            itemsCountPerPage={perPage}
            totalItemsCount={total}
            onChange={(pageNum) => setpage(pageNum)}
          />
          {/* clear all button */}
          {/* <div className="showItems">
            <button className="btn effect" data-sm-link-text="Remove All">
              <span>CHECK LIST</span>
            </button>
          </div> */}
        </div>
      </div>
    </>
  );
};
export default Todo;
