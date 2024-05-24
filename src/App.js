import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const fetchUsersData = (page) => {
    axios
      .get(`https://reqres.in/api/users?page=${page}`)
      .then((res) => {
        console.log(res.data);
        setData(res.data.data);
        setTotalPages(res.data.total_pages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    fetchUsersData(page);
  }, [page]);

  useEffect(() => {
    if (!debouncedValue) {
      setFilteredUsers(data);
    }
    let filteredValues = data.filter((d) =>
      d.first_name.toLowerCase().includes(debouncedValue.toLowerCase())
    );
    setFilteredUsers(filteredValues);
  }, [debouncedValue, data]);

  const onSearchChange = (e) => setSearch(e.target.value);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  return (
    <div className="">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="card">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <h4 className="text">User Info</h4>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={onSearchChange}
                />
              </div>
            </div>
            {filteredUsers &&
              filteredUsers.map((item) => (
                <div className="user-data">
                  <div className="usercontent">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img className="image-div" src={item.avatar} alt="" />
                    </div>
                    <div>
                      <p>{item.first_name}</p>
                      <p>{item.email}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div></div>
        </div>
      </div>
      {filteredUsers?.length > 0 && debouncedValue === "" ? (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
