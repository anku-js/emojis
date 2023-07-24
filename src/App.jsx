import React, { useEffect, useState } from "react";
import "./App.css";
export default function App() {
  const dataFromLocalStorage = JSON.parse(localStorage.getItem("emojis")) || [];
  const [emojis, setEmojis] = useState(dataFromLocalStorage);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [filteredCategory, setFilteredCategory] =
    useState(dataFromLocalStorage);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [pageNumberLimit, setpageNumberLimit] = useState(10);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(10);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredCategory.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  let categories = ["All"];
  for (let i = 0; i < emojis.length; i++) {
    if (categories.indexOf(emojis[i].category) === -1) {
      categories.push(emojis[i].category);
    }
  }
  function filterCategory(event) {
    const { value } = event.target;
    setSelectedCategory(value);
    let filteredEmojis = emojis.filter((emoji) => emoji.category === value);
    if (value === "All") {
      setFilteredCategory(emojis);
    } else {
      setFilteredCategory(filteredEmojis);
    }
  }

  function selectPageHandler(selectedPage) {
    if (
      selectedPage >= 1 &&
      selectedPage <= filteredCategory.length / 12 &&
      selectedPage !== page
    ) {
      setPage(selectedPage);
    }
  }
  const handleNextbtn = () => {
    setPage(page + 1);

    if (page + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };
  const handlePrevbtn = () => {
    setPage(page - 1);

    if ((page - 1) % pageNumberLimit == 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };
  let pageIncrementBtn = null;
  if (pageNumbers.length > maxPageNumberLimit) {
    pageIncrementBtn = (
      <p className="hellip" onClick={handleNextbtn}>
        {" "}
        &hellip;{" "}
      </p>
    );
  }

  let pageDecrementBtn = null;
  if (minPageNumberLimit >= 1) {
    pageDecrementBtn = (
      <p className="hellip" onClick={handlePrevbtn}>
        {" "}
        &hellip;{" "}
      </p>
    );
  }

  useEffect(() => {
    if (emojis.length === 0) {
      fetch("https://emojihub.yurace.pro/api/all")
        .then((res) => res.json())
        .then((data) => {
          setEmojis(data);
          localStorage.setItem("emojis", JSON.stringify(data));
          setFilteredCategory(data);
        });
    }
  }, []);

  return (
    <div>
      {emojis.length > 0 ? (
        <div className="container">
          <div className="sidebar">
            <p className="select-category">Select category</p>
            <ul className="category-list">
              {categories.map((category) => (
                <li key={category}>
                  {" "}
                  <label className="category-label" htmlFor="emojis">
                    <input
                      onChange={filterCategory}
                      type="radio"
                      className="category-input"
                      id="emojis"
                      value={category}
                      name="emojis"
                      checked={selectedCategory === category}
                    />
                    {category[0].toUpperCase() + category.substring(1)}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="mainContent">
            <p className="emoji-category">
              <strong>Category: </strong>
              {selectedCategory}
            </p>
            <div className="emoji-list">
              {filteredCategory.slice(page * 12 - 12, page * 12).map((prod) => (
                <div className="emoji__single" key={prod.name}>
                  <div className="emoji-information">
                    <p
                      className="emoji-name"
                      title={
                        prod.name[0].toUpperCase() +
                        prod.name.substring(1).split("≊")[0]
                      }
                    >
                      {prod.name[0].toUpperCase() +
                        prod.name.substring(1).split("≊")[0]}
                    </p>
                    <p className="emoji-group">({prod.group})</p>
                  </div>

                  <p
                    className="emoji"
                    dangerouslySetInnerHTML={{
                      __html: prod.htmlCode.join(""),
                    }}
                  ></p>
                </div>
              ))}
            </div>
            {filteredCategory.length > 0 && (
              <div className="pagination">
                <button
                  disabled={page == pageNumbers[0] ? true : false}
                  className="pagination-arrow"
                  onClick={handlePrevbtn}
                >
                  ◀️
                </button>
                {pageDecrementBtn}
                {pageNumbers.map((number) => {
                  if (
                    number < maxPageNumberLimit + 1 &&
                    number > minPageNumberLimit
                  ) {
                    return (
                      <div className="pagenation-numbers" key={number}>
                        <span
                          key={number}
                          className={
                            page === number ? "pagination__selected" : ""
                          }
                          onClick={() => selectPageHandler(number)}
                        >
                          {number}
                        </span>
                      </div>
                    );
                  } else {
                    return null;
                  }
                })}
                {pageIncrementBtn}
                <button
                  disabled={
                    page == pageNumbers[pageNumbers.length - 1] ? true : false
                  }
                  className="pagination-arrow"
                  onClick={handleNextbtn}
                >
                  ▶️
                </button>
              </div>
            )}
            <p className="pageNumber-info">
              {pageNumbers.length < maxPageNumberLimit
                ? `${minPageNumberLimit + 1} - ${pageNumbers.length} out of ${
                    pageNumbers.length
                  } pages`
                : `${minPageNumberLimit + 1} - ${maxPageNumberLimit} out of ${
                    pageNumbers.length
                  } pages`}
            </p>
          </div>
        </div>
      ) : (
        <div className="loading-container">
          <div class="lds-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        // <div class="spinner-border" role="status">
        //   <span class="sr-only">Loading...</span>
        //   <div class="spinner-border"></div>
        // </div>
        // <div className="loading">Loading...</div>
      )}
    </div>
  );
}
// 619
