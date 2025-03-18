import React, { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecipes } from "../../redux/apiClients/recipeAPI";
import { useNavigate } from "react-router-dom";
import { recipesListSelector } from "../../redux/selectors/selectors";

const AutoCompleteSearch = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const recipes = useSelector(recipesListSelector);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query.length > 3) {
      dispatch(fetchRecipes({ sortValue: "all", page: 1, pageSize: 200 }));
    }
  }, [query, dispatch]);

  const handleSelect = (event, value) => {
    if (value) {
      navigate(`/recipes/${value._id}`);
    }
  };

  return (
    <Autocomplete
      options={recipes || []}
      getOptionLabel={(option) => option.name}
      onChange={handleSelect}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Recipes"
          variant="outlined"
          size="small"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            width: 350,
            bgcolor: "transparent",
            "& .MuiOutlinedInput-root": {
              borderRadius: 20,
            },
          }}
        />
      )}
    />
  );
};

export default AutoCompleteSearch;
